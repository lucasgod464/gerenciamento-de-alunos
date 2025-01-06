import { DashboardLayout } from "@/components/DashboardLayout";
import { ChartManager } from "@/components/admin/dashboard/charts/ChartManager";

const AdminDashboard = () => {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie os dados da sua escola
          </p>
        </div>
        
        <ChartManager />
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;