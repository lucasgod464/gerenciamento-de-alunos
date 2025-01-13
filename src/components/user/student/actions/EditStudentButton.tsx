import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Student } from "@/types/student";
import { useState } from "react";
import { StudentForm } from "../../StudentForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface EditStudentButtonProps {
  student: Student;
  onEdit: (student: Student) => void;
}

export function EditStudentButton({ student, onEdit }: EditStudentButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (updatedStudent: Student) => {
    onEdit({
      ...updatedStudent,
      id: student.id,
      companyId: student.companyId,
      createdAt: student.createdAt
    });
    setIsOpen(false);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="hover:bg-green-50 hover:text-green-600"
              onClick={() => setIsOpen(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Editar dados do aluno</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Aluno</DialogTitle>
          </DialogHeader>
          <StudentForm 
            initialData={student}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
