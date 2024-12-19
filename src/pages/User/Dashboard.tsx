import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfile } from "@/components/user/UserProfile";
import { StudentRegistration } from "@/components/user/StudentRegistration";
import { AttendanceControl } from "@/components/user/AttendanceControl";
import { SystemReport } from "@/components/user/SystemReport";

const UserDashboard = () => {
  return (
    <DashboardLayout role="user">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Painel do Usuário</h1>
          <p className="text-muted-foreground">
            Gerencie seus alunos e acompanhe o desempenho
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="students">Cadastro de Alunos</TabsTrigger>
            <TabsTrigger value="attendance">Controle de Presença</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <UserProfile />
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <StudentRegistration />
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4">
            <AttendanceControl />
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <SystemReport />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;