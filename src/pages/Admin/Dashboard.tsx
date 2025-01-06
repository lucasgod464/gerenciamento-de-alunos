import { DashboardLayout } from "@/components/DashboardLayout";
import { CustomFieldsChart } from "@/components/admin/dashboard/CustomFieldsChart";

const AdminDashboard = () => {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Dashboard do Administrador</h1>
          <p className="text-muted-foreground">
            Visualize estatísticas e dados importantes da sua empresa
          </p>
        </div>

        <div className="grid gap-6">
          <CustomFieldsChart />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;