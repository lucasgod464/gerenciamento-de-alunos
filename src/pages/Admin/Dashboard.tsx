import { DashboardLayout } from "@/components/DashboardLayout";
import { CustomFieldsChart } from "@/components/admin/dashboard/CustomFieldsChart";

const AdminDashboard = () => {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard do Administrador</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao painel de controle administrativo
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <CustomFieldsChart />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;