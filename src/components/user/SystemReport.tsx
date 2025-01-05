import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileSpreadsheet } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { RoomSelector } from "./reports/RoomSelector";
import { AttendanceChart } from "./reports/AttendanceChart";
import { GeneralStats } from "./reports/GeneralStats";
import { startOfMonth, endOfMonth, format, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect } from "react";
import { DateRangeFilter } from "./reports/DateRangeFilter";

export const SystemReport = () => {
  const [selectedRoom, setSelectedRoom] = useState("all");
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: authorizedRooms = [] } = useQuery({
    queryKey: ["authorized-rooms", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data: userRooms, error } = await supabase
        .from("user_rooms")
        .select(`
          room_id,
          rooms (
            id,
            name,
            room_students (
              student_id,
              students (*)
            )
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;
      return userRooms?.map(ur => ur.rooms) || [];
    },
  });

  // Buscar dados de presença do período selecionado
  const { data: attendanceData = [], refetch: refetchAttendance } = useQuery({
    queryKey: ["attendance-data", user?.id, selectedRoom, dateRange],
    queryFn: async () => {
      if (!user?.id || !dateRange.from || !dateRange.to) return [];
      
      const startDate = format(startOfDay(dateRange.from), 'yyyy-MM-dd');
      const endDate = format(endOfDay(dateRange.to), 'yyyy-MM-dd');
      
      let query = supabase
        .from("daily_attendance")
        .select("*")
        .gte('date', startDate)
        .lte('date', endDate);

      if (selectedRoom !== "all") {
        query = query.eq("room_id", selectedRoom);
      } else {
        query = query.in("room_id", authorizedRooms?.map(room => room.id) || []);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Agrupar por data
      const groupedData = data.reduce((acc, curr) => {
        const date = format(new Date(curr.date), 'dd/MM', { locale: ptBR });
        if (!acc[date]) {
          acc[date] = { presente: 0, falta: 0, atrasado: 0, justificado: 0 };
        }
        switch (curr.status) {
          case 'present':
            acc[date].presente++;
            break;
          case 'absent':
            acc[date].falta++;
            break;
          case 'late':
            acc[date].atrasado++;
            break;
          case 'justified':
            acc[date].justificado++;
            break;
        }
        return acc;
      }, {});

      return Object.entries(groupedData).map(([name, values]) => ({
        name,
        ...values
      }));
    },
  });

  // Configurar canal realtime para atualizações de presença
  useEffect(() => {
    const channel = supabase
      .channel('attendance-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'daily_attendance',
          filter: selectedRoom !== "all" ? `room_id=eq.${selectedRoom}` : undefined
        },
        () => {
          refetchAttendance();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedRoom, refetchAttendance]);

  // Calcular estatísticas gerais
  const filteredRooms = selectedRoom === "all" 
    ? authorizedRooms 
    : authorizedRooms.filter(room => room.id === selectedRoom);

  const totalStudents = filteredRooms.reduce((acc, room) => 
    acc + (room.room_students?.length || 0), 0);

  const totalRooms = filteredRooms.length;

  const averageAttendance = attendanceData?.reduce((acc, curr) => 
    acc + curr.presente, 0) / (attendanceData?.length || 1);

  const handleExportReport = () => {
    toast({
      title: "Exportando relatório",
      description: "Seu relatório será baixado em breve",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 items-center flex-wrap">
          <RoomSelector
            rooms={authorizedRooms}
            selectedRoom={selectedRoom}
            onRoomChange={setSelectedRoom}
          />
          <DateRangeFilter
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        </div>

        <Button variant="outline" onClick={handleExportReport}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      <GeneralStats
        averageAttendance={averageAttendance}
        totalStudents={totalStudents}
        totalRooms={totalRooms}
      />

      <AttendanceChart data={attendanceData || []} />
    </div>
  );
};
