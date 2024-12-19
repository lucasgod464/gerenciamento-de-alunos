import { DashboardLayout } from "@/components/DashboardLayout";
import { AdminProfile } from "@/components/admin/AdminProfile";

const Profile = () => {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Meu Perfil</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações de acesso
          </p>
        </div>
        <AdminProfile />
      </div>
    </DashboardLayout>
  );
};

export default Profile;