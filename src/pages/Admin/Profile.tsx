import { DashboardLayout } from "@/components/DashboardLayout";
import { AdminProfile } from "@/components/admin/AdminProfile";

const Profile = () => {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie suas informações pessoais e preferências de conta
          </p>
        </div>
        <AdminProfile />
      </div>
    </DashboardLayout>
  );
};

export default Profile;
