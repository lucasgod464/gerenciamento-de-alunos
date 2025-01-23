import { DashboardLayout } from "@/components/DashboardLayout";
import { UserProfile } from "@/components/user/UserProfile";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Bell, Lock } from "lucide-react";

const Profile = () => {
  return (
    <DashboardLayout role="user">
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Meu Perfil</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais e preferências
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex flex-col items-center space-y-1.5">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-base font-medium text-muted-foreground">
                  Informações Pessoais
                </h3>
                <p className="text-sm text-center text-muted-foreground">
                  Atualize seus dados cadastrais
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex flex-col items-center space-y-1.5">
                <div className="p-2 bg-green-100 rounded-full">
                  <Bell className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-base font-medium text-muted-foreground">
                  Notificações
                </h3>
                <p className="text-sm text-center text-muted-foreground">
                  Configure suas preferências
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex flex-col items-center space-y-1.5">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Lock className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-base font-medium text-muted-foreground">
                  Segurança
                </h3>
                <p className="text-sm text-center text-muted-foreground">
                  Altere sua senha de acesso
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <UserProfile />
      </div>
    </DashboardLayout>
  );
};

export default Profile;