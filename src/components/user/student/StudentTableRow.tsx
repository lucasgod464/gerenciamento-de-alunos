import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Student } from "@/types/student";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StudentForm } from "../StudentForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface StudentTableRowProps {
  student: Student;
  rooms: { id: string; name: string }[];
  onDelete: (id: string) => void;
  onUpdate: (student: Student) => void;
}

export function StudentTableRow({
  student,
  rooms,
  onDelete,
  onUpdate,
}: StudentTableRowProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const currentRoom = rooms.find(room => room.id === student.room);

  return (
    <>
      <TableRow>
        <TableCell>{student.name}</TableCell>
        <TableCell>
          {format(new Date(student.birthDate), "dd 'de' MMMM 'de' yyyy", {
            locale: ptBR,
          })}
        </TableCell>
        <TableCell>
          {currentRoom ? (
            <Badge variant="secondary">{currentRoom.name}</Badge>
          ) : (
            <Badge variant="outline">Sem sala</Badge>
          )}
        </TableCell>
        <TableCell>
          <Badge variant={student.status ? "default" : "destructive"}>
            {student.status ? "Ativo" : "Inativo"}
          </Badge>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowEditDialog(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o aluno {student.name}? Esta ação não
              pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(student.id);
                setShowDeleteDialog(false);
              }}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Aluno</DialogTitle>
          </DialogHeader>
          <StudentForm
            initialData={student}
            onSubmit={(updatedStudent) => {
              onUpdate(updatedStudent);
              setShowEditDialog(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}