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
import { startOfMonth, endOfMonth, format, subMonths, addMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const SystemReport = () => {
  const [selectedRoom, setSelectedRoom] = useState("all");
  const [currentDate, setCurrentDate] = useState(new Date());
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

  // Buscar dados de presença do mês selecionado
  const { data: attendanceData = [] } = useQuery({
    queryKey: ["attendance-data", user?.id, selectedRoom, currentDate],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const startDate = format(startOfMonth(currentDate), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(currentDate), 'yyyy-MM-dd');
      
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
          acc[date] = { presente: 0, ausente: 0, atrasado: 0, justificado: 0 };
        }
        acc[date][curr.status]++;
        return acc;
      }, {});

      return Object.entries(groupedData).map(([name, values]) => ({
        name,
        presente: values.presente,
        ausente: values.ausente,
        atrasado: values.atrasado,
        justificado: values.justificado
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
    acc + curr.presente, 0) / (attendanceData?.length || 1);

  const handleExportReport = () => {
    toast({
      title: "Exportando relatório",
      description: "Seu relatório será baixado em breve",
    });
  };

  const handlePreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 items-center">
          <RoomSelector
            rooms={authorizedRooms}
            selectedRoom={selectedRoom}
            onRoomChange={setSelectedRoom}
          />
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handlePreviousMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-[120px] text-center">
              {format(currentDate, 'MMMM/yyyy', { locale: ptBR })}
            </span>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleNextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button variant="outline" onClick={handleExportReport}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <AttendanceChart data={attendanceData || []} />
        <StudentDistributionChart 
          rooms={filteredRooms}
          selectedRoom={selectedRoom}
          currentDate={currentDate}
          attendanceData={attendanceData || []}
        />
      </div>

      <GeneralStats
        averageAttendance={averageAttendance}
        totalStudents={totalStudents}
        totalRooms={totalRooms}
      />
    </div>
  );
};
