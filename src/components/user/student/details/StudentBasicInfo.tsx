import { Card } from "@/components/ui/card";
import { Student } from "@/types/student";

interface StudentBasicInfoProps {
  student: Student;
}

export function StudentBasicInfo({ student }: StudentBasicInfoProps) {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-2">Dados do Aluno</h3>
      <div className="space-y-2">
        <p><span className="font-medium">Nome:</span> {student.name}</p>
        <p><span className="font-medium">Data de Nascimento:</span> {student.birthDate}</p>
        {student.email && (
          <p><span className="font-medium">Email:</span> {student.email}</p>
        )}
      </div>
    </Card>
  );
}