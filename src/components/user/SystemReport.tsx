import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AttendanceChart } from "./reports/AttendanceChart";
import { GeneralStats } from "./reports/GeneralStats";
import { format, startOfDay, endOfDay, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ReportHeader } from "./reports/ReportHeader";

export const SystemReport = () => {
  const today = new Date();
  const [selectedRoom, setSelectedRoom] = useState("all");
  const [dateRange, setDateRange] = useState({
    from: subDays(today, 29),
    to: today
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: authorizedRooms = [], refetch: refetchRooms } = useQuery({
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

  useEffect(() => {
    refetchRooms();
    refetchAttendance();
  }, [refetchRooms, refetchAttendance]);

  const handleRefresh = async () => {
    try {
      await Promise.all([refetchRooms(), refetchAttendance()]);
      toast({
        title: "Dados atualizados",
        description: "Os dados foram atualizados com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar os dados",
        variant: "destructive",
      });
    }
  };

  // Calcular estatísticas gerais
  const filteredRooms = selectedRoom === "all" 
    ? authorizedRooms 
    : authorizedRooms.filter(room => room.id === selectedRoom);

  const totalStudents = filteredRooms.reduce((acc, room) => 
    acc + (room.room_students?.length || 0), 0);

  const totalRooms = filteredRooms.length;

  const averageAttendance = attendanceData?.reduce((acc, curr) => 
    acc + curr.presente, 0) / (attendanceData?.length || 1);

  return (
    <div className="space-y-6">
      <ReportHeader
        rooms={authorizedRooms}
        selectedRoom={selectedRoom}
        dateRange={dateRange}
        onRoomChange={setSelectedRoom}
        onDateRangeChange={setDateRange}
        onRefresh={handleRefresh}
      />

      <GeneralStats
        averageAttendance={averageAttendance}
        totalStudents={totalStudents}
        totalRooms={totalRooms}
      />

      <AttendanceChart data={attendanceData || []} />
    </div>
  );
};