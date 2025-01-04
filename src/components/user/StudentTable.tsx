import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Student } from "@/types/student";
import { useState, useEffect } from "react";
import { StudentForm } from "./StudentForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StudentTableActions } from "./StudentTableActions";
import { StudentInfoDialog } from "./StudentInfoDialog";
import { useStudentTableState } from "./student/useStudentTableState";
import { supabase } from "@/integrations/supabase/client";

interface StudentTableProps {
  students: Student[];
  rooms: { id: string; name: string }[];
  onDeleteStudent: (id: string) => void;
  onUpdateStudent: (student: Student) => void;
  onTransferStudent?: (studentId: string, newRoomId: string) => void;
  showTransferOption?: boolean;
  currentRoomId?: string;
}

export function StudentTable({
  students,
  rooms: initialRooms,
  onDeleteStudent,
  onUpdateStudent,
  onTransferStudent,
  showTransferOption = false,
  currentRoomId,
}: StudentTableProps) {
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showingInfo, setShowingInfo] = useState<Student | null>(null);
  const { localStudents, handleUpdateStudent } = useStudentTableState(students);
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>(initialRooms);

  useEffect(() => {
    const loadRoomStudents = async () => {
      const { data: roomStudentsData, error } = await supabase
        .from('room_students')
        .select(`
          room_id,
          student_id,
          rooms (
            id,
            name
          )
        `)
        .in('student_id', students.map(s => s.id));

      if (error) {
        console.error('Erro ao carregar relação sala-aluno:', error);
        return;
      }

      // Atualiza o estado local dos alunos com as informações das salas
      const updatedStudents = localStudents.map(student => {
        const roomStudent = roomStudentsData?.find(rs => rs.student_id === student.id);
        return {
          ...student,
          room: roomStudent?.rooms?.name || null
        };
      });

      handleUpdateStudent(updatedStudents);
    };

    loadRoomStudents();
  }, [students]);

  const getRoomName = (roomId: string | undefined | null) => {
    if (!roomId) return "Sem sala";
    const room = rooms.find((r) => r.id === roomId);
    return room ? room.name : "Sem sala";
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Documento</TableHead>
            <TableHead>Sala</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localStudents.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.email || "-"}</TableCell>
              <TableCell>{student.document || "-"}</TableCell>
              <TableCell>{student.room || "Sem sala"}</TableCell>
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
              <TableCell>
                <StudentTableActions
                  student={student}
                  onEdit={() => setEditingStudent(student)}
                  onDelete={onDeleteStudent}
                  onShowInfo={() => setShowingInfo(student)}
                  onTransfer={onTransferStudent}
                  showTransferOption={showTransferOption}
                  currentRoomId={currentRoomId}
                  rooms={rooms}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingStudent && (
        <Dialog open={!!editingStudent} onOpenChange={() => setEditingStudent(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Aluno</DialogTitle>
            </DialogHeader>
            <StudentForm
              initialData={editingStudent}
              onSubmit={(data) => {
                onUpdateStudent(data);
                setEditingStudent(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {showingInfo && (
        <StudentInfoDialog
          student={showingInfo}
          open={!!showingInfo}
          onOpenChange={() => setShowingInfo(null)}
        />
      )}
    </div>
  );
}