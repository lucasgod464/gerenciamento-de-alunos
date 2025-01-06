import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardStats } from "@/components/superadmin/dashboard/DashboardStats";
import { RecentCompanies } from "@/components/superadmin/dashboard/RecentCompanies";
import { CompaniesGrowthChart } from "@/components/superadmin/dashboard/CompaniesGrowthChart";
import { StorageUsageChart } from "@/components/superadmin/dashboard/StorageUsageChart";
import { ActiveUsersChart } from "@/components/superadmin/dashboard/ActiveUsersChart";
import { CompanyLocationsMap } from "@/components/superadmin/dashboard/CompanyLocationsMap";

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

        <div className="grid gap-4 md:grid-cols-2">
          <CompaniesGrowthChart />
          <StorageUsageChart />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <ActiveUsersChart />
          </div>
          <RecentCompanies />
        </div>

        <CompanyLocationsMap />
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;