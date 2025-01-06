import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { UserStats } from "@/components/users/UserStats";
import { RoomStats } from "@/components/rooms/RoomStats";
import { StudyStats } from "@/components/studies/StudyStats";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { CustomFieldsChart } from "@/components/admin/dashboard/CustomFieldsChart";

const AdminDashboard = () => {
  const { user: currentUser } = useAuth();

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
          <UserStats />
          <RoomStats />
          <StudyStats />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <CustomFieldsChart />
        </div>

        <DashboardTabs />
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;