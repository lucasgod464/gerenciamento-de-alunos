import { DashboardLayout } from "@/components/DashboardLayout";

const SuperAdminDashboard = () => {
  return (
    <DashboardLayout role="super-admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Dashboard Super Admin</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao painel de super administrador
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;