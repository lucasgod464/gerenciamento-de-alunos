import { SuperAdminProfile } from "@/components/superadmin/SuperAdminProfile";
import { DashboardLayout } from "@/components/DashboardLayout";

const Profile = () => {
  return (
    <DashboardLayout role="super-admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Meu Perfil</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações de acesso
          </p>
        </div>
        <SuperAdminProfile />
      </div>
    </DashboardLayout>
  );
};

export default Profile;
