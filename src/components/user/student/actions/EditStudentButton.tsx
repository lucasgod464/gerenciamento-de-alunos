import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Student } from "@/types/student";

interface EditStudentButtonProps {
  student: Student;
  onEdit: (student: Student) => void;
}

export function EditStudentButton({ student, onEdit }: EditStudentButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="hover:bg-green-50 hover:text-green-600"
            onClick={() => onEdit(student)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Editar dados do aluno</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}