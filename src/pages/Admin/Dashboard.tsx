import { DashboardLayout } from "@/components/DashboardLayout";
import { ChartManager } from "@/components/admin/dashboard/ChartManager";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Home, Ban } from "lucide-react";
import { AttendanceChart } from "@/components/admin/dashboard/AttendanceChart";

const AdminDashboard = () => {
  const { user } = useAuth();

  const { data: stats = { rooms: 0, activeUsers: 0, inactiveUsers: 0 } } = useQuery({
    queryKey: ["dashboard-stats", user?.companyId],
    queryFn: async () => {
      if (!user?.companyId) return { rooms: 0, activeUsers: 0, inactiveUsers: 0 };

      const { data: rooms } = await supabase
        .from("rooms")
        .select("id")
        .eq("company_id", user.companyId);

      const { data: activeUsers } = await supabase
        .from("emails")
        .select("id")
        .eq("company_id", user.companyId)
        .eq("status", "active");

      const { data: inactiveUsers } = await supabase
        .from("emails")
        .select("id")
        .eq("company_id", user.companyId)
        .eq("status", "inactive");

      return {
        rooms: rooms?.length || 0,
        activeUsers: activeUsers?.length || 0,
        inactiveUsers: inactiveUsers?.length || 0,
      };
    },
  });

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Dashboard do Administrador</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao painel de controle administrativo
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex flex-col items-center space-y-1.5">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Home className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-base font-medium text-muted-foreground">
                  Total de Salas
                </h3>
                <p className="text-3xl font-bold text-blue-600">{stats.rooms}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex flex-col items-center space-y-1.5">
                <div className="p-2 bg-green-100 rounded-full">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-base font-medium text-muted-foreground">
                  Usuários Ativos
                </h3>
                <p className="text-3xl font-bold text-green-600">{stats.activeUsers}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex flex-col items-center space-y-1.5">
                <div className="p-2 bg-red-100 rounded-full">
                  <Ban className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-base font-medium text-muted-foreground">
                  Usuários Inativos
                </h3>
                <p className="text-3xl font-bold text-red-600">{stats.inactiveUsers}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <AttendanceChart />
          <ChartManager />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;