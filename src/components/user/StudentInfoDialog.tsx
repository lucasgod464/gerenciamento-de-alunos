import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Student } from "@/types/student";

interface StudentInfoDialogProps {
  student: Student | null;
  onClose: () => void;
}

export function StudentInfoDialog({ student, onClose }: StudentInfoDialogProps) {
  if (!student) return null;

  return (
    <Dialog open={!!student} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Informações do Aluno</DialogTitle>
          <DialogDescription>
            Dados fornecidos durante a inscrição
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Campos básicos */}
          <div className="flex flex-col space-y-1.5">
            <label className="font-semibold">Nome</label>
            <p className="text-sm text-muted-foreground">{student.name}</p>
          </div>
          <div className="flex flex-col space-y-1.5">
            <label className="font-semibold">Data de Nascimento</label>
            <p className="text-sm text-muted-foreground">{student.birthDate}</p>
          </div>
          {student.email && (
            <div className="flex flex-col space-y-1.5">
              <label className="font-semibold">Email</label>
              <p className="text-sm text-muted-foreground">{student.email}</p>
            </div>
          )}
          {student.document && (
            <div className="flex flex-col space-y-1.5">
              <label className="font-semibold">Documento</label>
              <p className="text-sm text-muted-foreground">{student.document}</p>
            </div>
          )}
          {student.address && (
            <div className="flex flex-col space-y-1.5">
              <label className="font-semibold">Endereço</label>
              <p className="text-sm text-muted-foreground">{student.address}</p>
            </div>
          )}
          
          {/* Campos personalizados */}
          {student.customFields && Object.entries(student.customFields).map(([key, value]) => (
            <div key={key} className="flex flex-col space-y-1.5">
              <label className="font-semibold capitalize">
                {key.replace(/_/g, " ")}
              </label>
              <p className="text-sm text-muted-foreground">{value}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}