import { DashboardLayout } from "@/components/DashboardLayout";
import { SystemReport } from "@/components/user/reports/SystemReport";

const ReportsPage = () => {
  return (
    <DashboardLayout role="user">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Relatórios do Sistema</h1>
          <p className="text-muted-foreground">
            Visualize os relatórios do sistema
          </p>
        </div>
        <SystemReport />
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;