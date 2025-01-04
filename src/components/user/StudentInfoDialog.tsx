import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Student } from "@/types/student";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface StudentInfoDialogProps {
  student: Student | null;
  onClose: () => void;
}

export function StudentInfoDialog({ student, onClose }: StudentInfoDialogProps) {
  if (!student) return null;

  // Filter out duplicate fields from custom_fields that are already shown in basic fields
  const filteredCustomFields = student.custom_fields ? 
    Object.entries(student.custom_fields).filter(([key]) => {
      const normalizedKey = key.toLowerCase().replace(/_/g, '');
      return !['nome', 'nomecompleto', 'datanascimento', 'datadenanscimento'].includes(normalizedKey);
    }) : [];

  const InfoField = ({ label, value }: { label: string; value: string | null | undefined }) => {
    if (!value) return null;
    return (
      <div className="space-y-1">
        <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
        <dd className="text-sm text-foreground">{value}</dd>
      </div>
    );
  };

  return (
    <Dialog open={!!student} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Informações do Aluno</DialogTitle>
          <DialogDescription>
            Dados fornecidos durante a inscrição
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <Card className="p-6">
            <div className="space-y-6">
              {/* Informações básicas */}
              <div>
                <h3 className="text-lg font-medium mb-4">Informações Básicas</h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoField label="Nome" value={student.name} />
                  <InfoField label="Data de Nascimento" value={student.birth_date} />
                  <InfoField label="Email" value={student.email} />
                  <InfoField label="Documento" value={student.document} />
                  <InfoField label="Endereço" value={student.address} />
                </dl>
              </div>

              {/* Campos personalizados */}
              {filteredCustomFields.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-medium mb-4">Informações Adicionais</h3>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredCustomFields.map(([key, value]) => (
                        <InfoField 
                          key={key}
                          label={key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                          value={Array.isArray(value) ? value.join(", ") : String(value)}
                        />
                      ))}
                    </dl>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}