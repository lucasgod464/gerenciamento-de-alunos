import { DashboardLayout } from "@/components/DashboardLayout";
import { AttendanceControl } from "@/components/user/AttendanceControl";

const AttendancePage = () => {
  return (
    <DashboardLayout role="user">
      <div className="space-y-6">
        <div className="text-center pb-6 border-b">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Controle de Presença
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie a presença dos seus alunos
          </p>
        </div>
        <AttendanceControl />
      </div>
    </DashboardLayout>
  );
};

export default AttendancePage;