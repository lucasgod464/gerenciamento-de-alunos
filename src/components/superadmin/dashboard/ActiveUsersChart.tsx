import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { subDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function ActiveUsersChart() {
  const { data: chartData = [] } = useQuery({
    queryKey: ["active-users"],
    queryFn: async () => {
      const days = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), i);
        return {
          date: format(date, "yyyy-MM-dd"),
          label: format(date, "dd/MM", { locale: ptBR }),
        };
      }).reverse();

      const { data: users } = await supabase
        .from("emails")
        .select("last_access")
        .not("last_access", "is", null);

      const dailyUsers = days.map(day => {
        const count = users?.filter(user => 
          user.last_access?.startsWith(day.date)
        ).length || 0;

        return {
          name: day.label,
          usuarios: count,
        };
      });

      return dailyUsers;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuários Ativos nos Últimos 7 Dias</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="usuarios" 
                stroke="#8884d8" 
                fill="#8884d8" 
                name="Usuários Ativos"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}