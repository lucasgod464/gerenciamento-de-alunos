import { DashboardLayout } from "@/components/DashboardLayout";

const Dashboard = () => {
  return (
    <DashboardLayout role="user">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao seu painel de controle
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;