import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface AttendanceHeaderProps {
  onSave: () => void;
}

export const AttendanceHeader = ({ onSave }: AttendanceHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6 pb-4 border-b">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-50 rounded-lg">
          <Users className="h-5 w-5 text-purple-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Lista de Alunos</h3>
          <p className="text-sm text-gray-500">
            Registre a presença dos alunos e adicione observações se necessário
          </p>
        </div>
      </div>
      <Button 
        onClick={onSave}
        className="bg-purple-600 hover:bg-purple-700"
      >
        Salvar Chamada
      </Button>
    </div>
  );
};