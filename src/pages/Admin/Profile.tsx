import { DashboardLayout } from "@/components/DashboardLayout";
import { AdminProfile } from "@/components/admin/AdminProfile";
import { Shield } from "lucide-react";

const Profile = () => {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center gap-3 pb-6 border-b">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Shield className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Meu Perfil</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Gerencie suas informações pessoais e preferências de conta
            </p>
          </div>
        </div>
        <AdminProfile />
      </div>
    </DashboardLayout>
  );
};

export default Profile;