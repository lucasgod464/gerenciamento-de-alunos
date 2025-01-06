import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardStats } from "@/components/superadmin/dashboard/DashboardStats";
import { RecentCompanies } from "@/components/superadmin/dashboard/RecentCompanies";
import { CompaniesGrowthChart } from "@/components/superadmin/dashboard/CompaniesGrowthChart";

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

        <DashboardStats />

        <div className="grid gap-4 md:grid-cols-3">
          <CompaniesGrowthChart />
          <RecentCompanies />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;