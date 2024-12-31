import { DashboardLayout } from "@/components/DashboardLayout";
import { AttendanceControl } from "@/components/user/AttendanceControl";

const AttendancePage = () => {
  return (
    <DashboardLayout role="user">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Controle de Presença</h1>
          <p className="text-muted-foreground">
            Gerencie a presença dos seus alunos
          </p>
        </div>
        <AttendanceControl />
      </div>
    </DashboardLayout>
  );
};

export default AttendancePage;