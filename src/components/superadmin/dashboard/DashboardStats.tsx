import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Users, DoorOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { DateFilter } from "./DateFilter";
import { format } from "date-fns";

export const DashboardStats = () => {
  const today = new Date();
  const [dateRange, setDateRange] = useState({
    from: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29),
    to: today
  });

  const { data: stats = { companies: 0, users: 0, rooms: 0 } } = useQuery({
    queryKey: ["dashboard-stats", dateRange],
    queryFn: async () => {
      const startDate = format(dateRange.from, 'yyyy-MM-dd');
      const endDate = format(dateRange.to, 'yyyy-MM-dd');

      const { data: companies } = await supabase
        .from("companies")
        .select("id")
        .gte("created_at", startDate)
        .lte("created_at", endDate);

      const { data: users } = await supabase
        .from("emails")
        .select("id")
        .gte("created_at", startDate)
        .lte("created_at", endDate);

      const { data: rooms } = await supabase
        .from("rooms")
        .select("id")
        .gte("created_at", startDate)
        .lte("created_at", endDate);

      return {
        companies: companies?.length || 0,
        users: users?.length || 0,
        rooms: rooms?.length || 0,
      };
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-start">
        <DateFilter 
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Empresas
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.companies}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Usuários
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Salas
            </CardTitle>
            <DoorOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rooms}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};