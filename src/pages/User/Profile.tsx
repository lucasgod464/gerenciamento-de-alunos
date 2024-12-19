import { DashboardLayout } from "@/components/DashboardLayout";
import { UserProfile } from "@/components/user/UserProfile";

const Profile = () => {
  return (
    <DashboardLayout role="user">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Perfil do Usuário</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais e preferências
          </p>
        </div>
        <UserProfile />
      </div>
    </DashboardLayout>
  );
};

export default Profile;