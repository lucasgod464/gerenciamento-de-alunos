import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Student } from "@/types/student";
import { useState } from "react";
import { StudentForm } from "./StudentForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StudentTableActions } from "./StudentTableActions";
import { StudentInfoDialog } from "./StudentInfoDialog";
import { useStudentTableState } from "./student/useStudentTableState";

interface StudentTableProps {
  students: Student[];
  rooms: { id: string; name: string }[];
  onDeleteStudent: (id: string) => void;
  onUpdateStudent?: (student: Student) => void;
  onTransferStudent?: (studentId: string, newRoomId: string) => void;
  currentRoomId?: string;
  showTransferOption?: boolean;
}

export function StudentTable({
  students,
  rooms,
  onDeleteStudent,
  onUpdateStudent,
  onTransferStudent,
  currentRoomId,
  showTransferOption = false,
}: StudentTableProps) {
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showingInfo, setShowingInfo] = useState<Student | null>(null);
  const { localStudents, handleUpdateStudent } = useStudentTableState(students);

  const getRoomName = (roomId: string | undefined | null) => {
    if (!roomId) return "Sem sala";
    const foundRoom = rooms.find(room => room.id === roomId);
    console.log("Procurando sala:", roomId, "Sala encontrada:", foundRoom);
    return foundRoom?.name || "Sem sala";
  };

  const handleSubmit = async (student: Student) => {
    try {
      await handleUpdateStudent(student);
      if (onUpdateStudent) {
        await onUpdateStudent(student);
      }
      setEditingStudent(null);
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error);
    }
  };

  // Adicionar log para debug
  console.log("Rooms disponíveis:", rooms);
  console.log("Estudantes com suas salas:", localStudents);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Data de Nascimento</TableHead>
            <TableHead>Sala</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localStudents.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.birthDate}</TableCell>
              <TableCell>{getRoomName(student.room)}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    student.status
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {student.status ? "Ativo" : "Inativo"}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <StudentTableActions
                  student={student}
                  showTransferOption={showTransferOption}
                  onInfoClick={setShowingInfo}
                  onEditClick={setEditingStudent}
                  onDeleteClick={onDeleteStudent}
                  onTransferStudent={onTransferStudent}
                  rooms={rooms}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!editingStudent} onOpenChange={() => setEditingStudent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Aluno</DialogTitle>
          </DialogHeader>
          {editingStudent && (
            <StudentForm
              initialData={editingStudent}
              onSubmit={handleSubmit}
            />
          )}
        </DialogContent>
      </Dialog>

      <StudentInfoDialog 
        student={showingInfo} 
        onClose={() => setShowingInfo(null)} 
      />
    </>
  );
}