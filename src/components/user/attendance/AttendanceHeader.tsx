import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface AttendanceHeaderProps {
  onSave: () => void;
}

export const AttendanceHeader = ({ onSave }: AttendanceHeaderProps) => {
  return (
    <Card className="p-4 mb-6 bg-white shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1.5">
          <h3 className="text-lg font-semibold text-gray-900">Lista de Alunos</h3>
          <p className="text-sm text-gray-500 max-w-[280px] sm:max-w-none">
            Registre a presença dos alunos e adicione observações se necessário
          </p>
        </div>
        <Button 
          size="lg"
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium"
          onClick={onSave}
        >
          Salvar Chamada
        </Button>
      </div>
    </Card>
  );
};