import { Button } from "@/components/ui/button";
import { Student } from "@/types/student";
import { Trash2, ArrowRight, Pencil, Info } from "lucide-react";

interface StudentTableActionsProps {
  student: Student;
  showTransferOption: boolean;
  onInfoClick: (student: Student) => void;
  onEditClick: (student: Student) => void;
  onDeleteClick: (studentId: string) => void;
}

export function StudentTableActions({
  student,
  showTransferOption,
  onInfoClick,
  onEditClick,
  onDeleteClick,
}: StudentTableActionsProps) {
  return (
    <div className="flex justify-end space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onInfoClick(student)}
      >
        <Info className="h-4 w-4" />
      </Button>
      {showTransferOption ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEditClick(student)}
        >
          <ArrowRight className="mr-2 h-4 w-4" />
          Transferir Aluno
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEditClick(student)}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDeleteClick(student.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}