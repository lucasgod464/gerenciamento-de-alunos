import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfDay, endOfDay, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Users, Home, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const AttendanceChart = () => {
  const today = new Date();
  const [selectedRoom, setSelectedRoom] = useState("all");
  const [dateRange, setDateRange] = useState({
    from: subDays(today, 29),
    to: today
  });
  const { user } = useAuth();

  // Buscar salas autorizadas
  const { data: rooms = [] } = useQuery({
    queryKey: ["rooms", user?.companyId],
    queryFn: async () => {
      if (!user?.companyId) return [];
      
      const { data, error } = await supabase
        .from("rooms")
        .select("id, name")
        .eq("company_id", user.companyId)
        .eq("status", true);

      if (error) throw error;
      return data || [];
    },
  });

  // Buscar dados de presença
  const { data: attendanceData = [], refetch: refetchAttendance } = useQuery({
    queryKey: ["attendance-data", selectedRoom, dateRange],
    queryFn: async () => {
      if (!user?.companyId || !dateRange.from || !dateRange.to) return [];
      
      const startDate = format(startOfDay(dateRange.from), 'yyyy-MM-dd');
      const endDate = format(endOfDay(dateRange.to), 'yyyy-MM-dd');
      
      let query = supabase
        .from("daily_attendance")
        .select("*")
        .eq("company_id", user.companyId)
        .gte('date', startDate)
        .lte('date', endDate);

      if (selectedRoom !== "all") {
        query = query.eq("room_id", selectedRoom);
      }

      const { data, error } = await query;
      if (error) throw error;

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

  // Buscar estatísticas gerais
  const { data: stats = { totalStudents: 0, activeRooms: 0, attendanceRate: 0 } } = useQuery({
    queryKey: ["attendance-stats", user?.companyId],
    queryFn: async () => {
      if (!user?.companyId) return { totalStudents: 0, activeRooms: 0, attendanceRate: 0 };

      const [studentsResult, roomsResult, attendanceResult] = await Promise.all([
        supabase
          .from("students")
          .select("id")
          .eq("company_id", user.companyId)
          .eq("status", true),
        supabase
          .from("rooms")
          .select("id")
          .eq("company_id", user.companyId)
          .eq("status", true),
        supabase
          .from("daily_attendance")
          .select("status")
          .eq("company_id", user.companyId)
      ]);

      const totalAttendances = attendanceResult.data?.length || 0;
      const totalPresences = attendanceResult.data?.filter(a => a.status === 'present').length || 0;
      const attendanceRate = totalAttendances > 0 
        ? (totalPresences / totalAttendances) * 100 
        : 0;

      return {
        totalStudents: studentsResult.data?.length || 0,
        activeRooms: roomsResult.data?.length || 0,
        attendanceRate
      };
    }
  });

  const handleRefresh = () => {
    refetchAttendance();
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Taxa de Presença
                </p>
                <h2 className="text-2xl font-bold">{stats.attendanceRate.toFixed(1)}%</h2>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total de Alunos
                </p>
                <h2 className="text-2xl font-bold">{stats.totalStudents}</h2>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Home className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Salas Ativas
                </p>
                <h2 className="text-2xl font-bold">{stats.activeRooms}</h2>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Select
              value={selectedRoom}
              onValueChange={setSelectedRoom}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Selecione uma sala" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as salas</SelectItem>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <DatePickerWithRange
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />

            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              className="h-10 w-10"
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="presente" name="Presente" fill="#22c55e" />
                <Bar dataKey="falta" name="Falta" fill="#ef4444" />
                <Bar dataKey="atrasado" name="Atrasado" fill="#eab308" />
                <Bar dataKey="justificado" name="Justificado" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};