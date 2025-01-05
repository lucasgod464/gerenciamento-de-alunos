import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileSpreadsheet } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { RoomSelector } from "./reports/RoomSelector";
import { AttendanceChart } from "./reports/AttendanceChart";
import { StudentDistributionChart } from "./reports/StudentDistributionChart";
import { GeneralStats } from "./reports/GeneralStats";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const SystemReport = () => {
  const [selectedRoom, setSelectedRoom] = useState("all");
  const { toast } = useToast();
  const { user } = useAuth();

  // Buscar salas autorizadas do usuário
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

  // Buscar dados de presença do mês atual
  const { data: attendanceData } = useQuery({
    queryKey: ["attendance-data", user?.id, selectedRoom],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const startDate = format(startOfMonth(new Date()), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(new Date()), 'yyyy-MM-dd');
      
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
        const date = format(new Date(curr.date), 'MMMM', { locale: ptBR });
        if (!acc[date]) {
          acc[date] = { presenca: 0, faltas: 0, total: 0 };
        }
        if (curr.status === 'present') {
          acc[date].presenca++;
        } else {
          acc[date].faltas++;
        }
        acc[date].total++;
        return acc;
      }, {});

      return Object.entries(groupedData).map(([name, values]) => ({
        name,
        presenca: Math.round((values.presenca / values.total) * 100),
        faltas: Math.round((values.faltas / values.total) * 100),
      }));
    },
  });

  // Calcular estatísticas gerais
  const filteredRooms = selectedRoom === "all" 
    ? authorizedRooms 
    : authorizedRooms.filter(room => room.id === selectedRoom);

  const totalStudents = filteredRooms.reduce((acc, room) => 
    acc + (room.room_students?.length || 0), 0);

  const totalRooms = filteredRooms.length;

  const averageAttendance = attendanceData?.reduce((acc, curr) => 
    acc + curr.presenca, 0) / (attendanceData?.length || 1);

  const handleExportReport = () => {
    toast({
      title: "Exportando relatório",
      description: "Seu relatório será baixado em breve",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4">
          <RoomSelector
            rooms={authorizedRooms}
            selectedRoom={selectedRoom}
            onRoomChange={setSelectedRoom}
          />
        </div>

        <Button variant="outline" onClick={handleExportReport}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <AttendanceChart data={attendanceData || []} />
        <StudentDistributionChart rooms={filteredRooms} />
      </div>

      <GeneralStats
        averageAttendance={averageAttendance}
        totalStudents={totalStudents}
        totalRooms={totalRooms}
      />
    </div>
  );
};