import { DashboardLayout } from "@/components/DashboardLayout";
import { AttendanceControl } from "@/components/user/attendance/AttendanceControl";

const AttendancePage = () => {
  return (
    <DashboardLayout role="user">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h1 className="text-2xl font-bold text-gray-900">Controle de Presença</h1>
          <p className="text-gray-500">
            Gerencie a presença dos alunos de forma simples e eficiente
          </p>
        </div>
        <AttendanceControl />
      </div>
    </DashboardLayout>
  );
};

export default AttendancePage;