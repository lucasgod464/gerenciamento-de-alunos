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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { StudentForm } from "./StudentForm";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StudentTableActionsProps {
  student: Student;
  showTransferOption: boolean;
  onInfoClick: (student: Student) => void;
  onEditClick: (student: Student) => void;
  onDeleteClick: (studentId: string) => void;
  onTransferStudent?: (studentId: string, newRoomId: string) => void;
  rooms?: { id: string; name: string }[];
}

export function StudentTableActions({
  student,
  showTransferOption,
  onInfoClick,
  onEditClick,
  onDeleteClick,
  onTransferStudent,
  rooms = [],
}: StudentTableActionsProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("");

  const handleEditSubmit = (updatedStudent: Student) => {
    onEditClick(updatedStudent);
    setShowEditDialog(false);
  };

  const handleTransfer = () => {
    if (selectedRoom && onTransferStudent) {
      onTransferStudent(student.id, selectedRoom);
      setShowTransferDialog(false);
      setSelectedRoom("");
    }
  };

  return (
    <>
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

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="hover:bg-green-50 hover:text-green-600"
                onClick={() => setShowEditDialog(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Editar dados do aluno</p>
            </TooltipContent>
          </Tooltip>

          {showTransferOption && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-purple-50 hover:text-purple-600"
                  onClick={() => setShowTransferDialog(true)}
                >
                  <ArrowRightFromLine className="mr-2 h-4 w-4" />
                  Transferir
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Transferir aluno para uma sala</p>
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

      {/* Dialog de Edição */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Aluno</DialogTitle>
          </DialogHeader>
          <StudentForm
            initialData={student}
            onSubmit={handleEditSubmit}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de Transferência */}
      <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transferir Aluno</DialogTitle>
            <DialogDescription>
              Selecione a sala para onde deseja transferir o aluno {student.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={selectedRoom} onValueChange={setSelectedRoom}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma sala" />
              </SelectTrigger>
              <SelectContent>
                {rooms?.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              className="w-full" 
              onClick={handleTransfer}
              disabled={!selectedRoom}
            >
              Confirmar Transferência
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}