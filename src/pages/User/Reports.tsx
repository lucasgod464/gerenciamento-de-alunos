import { DashboardLayout } from "@/components/DashboardLayout";
import { Report } from "@/components/user/reports/Report";

const ReportsPage = () => {
  return (
    <DashboardLayout role="user">
      <div className="space-y-6 p-6"> {/* Added padding */}
        <div>
          <h1 className="text-2xl font-bold mb-2">Relatórios do Sistema</h1>
          <p className="text-muted-foreground">
            Visualize os relatórios do sistema
          </p>
        </div>
        <Report />
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
