import { DashboardLayout } from "@/components/DashboardLayout";

const UserDashboard = () => {
  return (
    <DashboardLayout role="user">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Dashboard Usuário</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao seu painel
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;