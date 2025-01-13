import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Student } from "@/types/student";

interface ViewStudentButtonProps {
  student: Student;
  onView: (student: Student) => void;
}

export function ViewStudentButton({ student, onView }: ViewStudentButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="hover:bg-blue-50 hover:text-blue-600"
            onClick={() => onView(student)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Ver informações completas do aluno</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
