import { DashboardLayout } from "@/components/DashboardLayout";
import { AttendanceControl } from "@/components/user/attendance/AttendanceControl";
import { CalendarDays, ClipboardCheck } from "lucide-react";

const AttendancePage = () => {
  return (
    <DashboardLayout role="user">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent p-8 rounded-lg border shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <ClipboardCheck className="h-8 w-8 text-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                Controle de Presença
              </h1>
              <p className="text-gray-500 mt-1 max-w-2xl">
                Gerencie a presença dos alunos de forma simples e eficiente. Selecione uma data e sala para começar.
              </p>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center gap-2 text-blue-500 mb-2">
                <CalendarDays className="h-5 w-5" />
                <h3 className="font-medium">Dicas Rápidas</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Selecione uma data no calendário</li>
                <li>• Escolha a sala desejada</li>
                <li>• Inicie a chamada</li>
                <li>• Registre presenças e observações</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="animate-fade-in">
          <AttendanceControl />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AttendancePage;