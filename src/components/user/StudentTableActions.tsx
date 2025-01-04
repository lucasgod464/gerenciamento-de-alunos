import { Button } from "@/components/ui/button";
import { Student } from "@/types/student";
import { Eye, Trash2, ArrowRightFromLine, Pencil } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="hover:bg-blue-50 hover:text-blue-600"
              onClick={() => onInfoClick(student)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ver informações do aluno</p>
          </TooltipContent>
        </Tooltip>

        {showTransferOption ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-purple-50 hover:text-purple-600"
                onClick={() => onEditClick(student)}
              >
                <ArrowRightFromLine className="mr-2 h-4 w-4" />
                Transferir
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Transferir aluno para uma sala</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="hover:bg-green-50 hover:text-green-600"
                onClick={() => onEditClick(student)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Editar dados do aluno</p>
            </TooltipContent>
          </Tooltip>
        )}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o aluno {student.name}? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDeleteClick(student.id)}>
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TooltipProvider>
    </div>
  );
}