import { DashboardLayout } from "@/components/DashboardLayout";
import { StudentRegistration } from "@/components/user/StudentRegistration";

const StudentsPage = () => {
  return (
    <DashboardLayout role="user">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Cadastro de Alunos</h1>
          <p className="text-muted-foreground">
            Gerencie o cadastro dos seus alunos
          </p>
        </div>
        <StudentRegistration />
      </div>
    </DashboardLayout>
  );
};

export default StudentsPage;