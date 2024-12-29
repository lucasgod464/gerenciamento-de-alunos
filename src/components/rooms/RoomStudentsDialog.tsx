import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StudentTable } from "@/components/user/StudentTable";
import { Student } from "@/types/student";
import { useToast } from "@/hooks/use-toast";
import { Room } from "@/types/room";

interface RoomStudentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  students: Student[];
  rooms: { id: string; name: string }[];
  currentRoomId: string;
  onDeleteStudent: (id: string) => void;
  onTransferStudent: (studentId: string, newRoomId: string) => void;
}

export function RoomStudentsDialog({
  open,
  onOpenChange,
  students,
  rooms,
  currentRoomId,
  onDeleteStudent,
  onTransferStudent,
}: RoomStudentsDialogProps) {
  const { toast } = useToast();

  const handleDeleteStudent = async (studentId: string) => {
    try {
      onDeleteStudent(studentId);
      toast({
        title: "Aluno removido",
        description: "O aluno foi removido com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao remover aluno",
        description: "Ocorreu um erro ao tentar remover o aluno.",
        variant: "destructive",
      });
    }
  };

  const handleTransferStudent = async (studentId: string, newRoomId: string) => {
    try {
      onTransferStudent(studentId, newRoomId);
      toast({
        title: "Aluno transferido",
        description: "O aluno foi transferido com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao transferir aluno",
        description: "Ocorreu um erro ao tentar transferir o aluno.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Alunos da Sala</DialogTitle>
          <DialogDescription>
            Lista de alunos matriculados nesta sala
          </DialogDescription>
        </DialogHeader>
        <StudentTable
          students={students}
          rooms={rooms}
          onDeleteStudent={handleDeleteStudent}
          onTransferStudent={handleTransferStudent}
          currentRoomId={currentRoomId}
          showTransferOption={true}
        />
      </DialogContent>
    </Dialog>
  );
}