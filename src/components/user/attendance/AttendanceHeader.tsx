import { Button } from "@/components/ui/button";

interface AttendanceHeaderProps {
  onSave: () => void;
}

export const AttendanceHeader = ({ onSave }: AttendanceHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Lista de Alunos</h3>
        <p className="text-sm text-muted-foreground">
          Registre a presença dos alunos e adicione observações se necessário
        </p>
      </div>
      <Button onClick={onSave}>Salvar Chamada</Button>
    </div>
  );
};