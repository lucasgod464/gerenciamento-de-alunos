import { DashboardLayout } from "@/components/DashboardLayout";
import { AttendanceControl } from "@/components/user/attendance/AttendanceControl";
import { CalendarDays, ClipboardCheck } from "lucide-react";

const AttendancePage = () => {
  return (
    <DashboardLayout role="user">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white p-8 rounded-lg shadow-sm border">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <ClipboardCheck className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Controle de Presença</h1>
              <p className="text-gray-500 max-w-2xl">
                Gerencie a presença dos alunos de forma simples e eficiente. Selecione uma data e sala para começar o registro de presença.
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex items-center gap-4 text-sm text-gray-600 border-t pt-6">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-gray-400" />
              <span>Registre presenças, faltas e observações</span>
            </div>
          </div>
        </div>
        
        <AttendanceControl />
      </div>
    </DashboardLayout>
  );
};

export default AttendancePage;