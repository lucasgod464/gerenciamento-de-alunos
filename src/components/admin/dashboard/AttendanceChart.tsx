import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { BarChart, Bar, YAxis, CartesianGrid, ResponsiveContainer, LabelList, Legend } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { DateFilter } from "@/components/superadmin/dashboard/DateFilter";
import { useState } from "react";
import { subDays } from "date-fns";
import { RoomSelector } from "@/components/user/reports/RoomSelector";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export const STATUS_COLORS = {
  presente: "#22c55e",
  falta: "#ef4444",
  atrasado: "#eab308",
  justificado: "#3b82f6"
};

export const STATUS_LABELS = {
  presente: "Presenças",
  falta: "Faltas",
  atrasado: "Atrasos",
  justificado: "Justificados"
};

export const AttendanceChart = () => {
  const { user } = useAuth();
  const today = new Date();
  const [selectedRoom, setSelectedRoom] = useState("all");
  const [dateRange, setDateRange] = useState({
    from: subDays(today, 29),
    to: today
  });

  const { data: rooms = [] } = useQuery({
    queryKey: ["rooms", user?.companyId],
    queryFn: async () => {
      if (!user?.companyId) return [];

      const { data } = await supabase
        .from("rooms")
        .select("id, name")
        .eq("company_id", user.companyId)
        .eq("status", true);

      return data || [];
    }
  });

  const { data: stats = { totalStudents: 0, activeRooms: 0, attendanceRate: 0 } } = useQuery({
    queryKey: ["attendance-stats", user?.companyId],
    queryFn: async () => {
      if (!user?.companyId) return { totalStudents: 0, activeRooms: 0, attendanceRate: 0 };

      const [studentsResult, roomsResult, attendanceResult] = await Promise.all([
        supabase.from("students").select("id").eq("company_id", user.companyId).eq("status", true),
        supabase.from("rooms").select("id").eq("company_id", user.companyId).eq("status", true),
        supabase.from("daily_attendance").select("status").eq("company_id", user.companyId)
      ]);

      const totalAttendances = attendanceResult.data?.length || 0;
      const totalPresences = attendanceResult.data?.filter(a => a.status === 'present').length || 0;
      const attendanceRate = totalAttendances > 0 ? (totalPresences / totalAttendances) * 100 : 0;

      return {
        totalStudents: studentsResult.data?.length || 0,
        activeRooms: roomsResult.data?.length || 0,
        attendanceRate
      };
    }
  });

  const { data: attendanceData = [], isLoading, refetch } = useQuery({
    queryKey: ["attendance-stats", user?.companyId, selectedRoom, dateRange],
    queryFn: async () => {
      if (!user?.companyId) return [];

      let query = supabase
        .from("daily_attendance")
        .select("status")
        .eq("company_id", user.companyId)
        .gte("date", dateRange.from.toISOString().split('T')[0])
        .lte("date", dateRange.to.toISOString().split('T')[0]);

      if (selectedRoom !== "all") {
        query = query.eq("room_id", selectedRoom);
      }

      const { data: attendance } = await query;

      if (!attendance) return [];

      const totals = attendance.reduce((acc: Record<string, number>, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
      }, {});

      return [{
        name: "Total",
        presente: totals["present"] || 0,
        falta: totals["absent"] || 0,
        atrasado: totals["late"] || 0,
        justificado: totals["justified"] || 0
      }];
    }
  });

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            Relatório de Presença
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          Carregando...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          Relatório de Presença
        </CardTitle>
        <div className="flex flex-wrap gap-4 items-center justify-between mt-4">
          <div className="flex gap-4 items-center flex-wrap">
            <RoomSelector
              rooms={rooms}
              selectedRoom={selectedRoom}
              onRoomChange={setSelectedRoom}
            />
            <DateFilter
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <YAxis />
              <Legend 
                formatter={(value) => STATUS_LABELS[value as keyof typeof STATUS_LABELS] || value}
              />
              {Object.entries(STATUS_COLORS).map(([status, color]) => (
                <Bar
                  key={status}
                  dataKey={status}
                  fill={color}
                  name={status}
                  radius={[4, 4, 0, 0]}
                >
                  <LabelList
                    dataKey={status}
                    position="center"
                    fill="#fff"
                    formatter={(value: number) => `${value} ${STATUS_LABELS[status as keyof typeof STATUS_LABELS]}`}
                  />
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
