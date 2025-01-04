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
import { StudentTableActions } from "./StudentTableActions";
import { StudentInfoDialog } from "./StudentInfoDialog";
import { useStudentTableState } from "./student/useStudentTableState";
import { useToast } from "@/hooks/use-toast";

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
  rooms: initialRooms,
  onDeleteStudent,
  onUpdateStudent,
  onTransferStudent,
  currentRoomId,
  showTransferOption = false,
}: StudentTableProps) {
  const [showingInfo, setShowingInfo] = useState<Student | null>(null);
  const { localStudents, setLocalStudents } = useStudentTableState(students);
  const { toast } = useToast();

  const getRoomName = (roomId: string | undefined | null) => {
    if (!roomId) return "Sem sala";
    const room = initialRooms.find(r => r.id === roomId);
    return room ? room.name : "Sem sala";
  };

  const handleUpdateStudent = async (updatedStudent: Student) => {
    try {
      setLocalStudents(prev => 
        prev.map(s => s.id === updatedStudent.id ? updatedStudent : s)
      );

      if (onUpdateStudent) {
        await onUpdateStudent(updatedStudent);
      }

      toast({
        title: "Sucesso",
        description: "Aluno atualizado com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar aluno. Tente novamente.",
        variant: "destructive",
      });
    }
  };

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
                  onEditClick={handleUpdateStudent}
                  onDeleteClick={onDeleteStudent}
                  onTransferStudent={onTransferStudent}
                  rooms={initialRooms}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <StudentInfoDialog 
        student={showingInfo} 
        onClose={() => setShowingInfo(null)} 
      />
    </>
  );
}