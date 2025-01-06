import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { BarChart, Bar, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

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

  const { data: attendanceData = [], isLoading } = useQuery({
    queryKey: ["attendance-stats", user?.companyId],
    queryFn: async () => {
      if (!user?.companyId) return [];

      const { data: attendance } = await supabase
        .from("daily_attendance")
        .select("status")
        .eq("company_id", user.companyId);

      if (!attendance) return [];

      const totals = attendance.reduce((acc: Record<string, number>, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(STATUS_LABELS).map(([key, label]) => ({
        name: label,
        value: totals[key] || 0
      }));
    }
  });

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
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <YAxis />
              <Legend />
              {Object.entries(STATUS_COLORS).map(([status, color]) => (
                <Bar
                  key={status}
                  dataKey="value"
                  fill={color}
                  name={STATUS_LABELS[status as keyof typeof STATUS_LABELS]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};