import { DashboardLayout } from "@/components/DashboardLayout";

const AdminDashboard = () => {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Dashboard Admin</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao painel de administrador
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;