import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Student } from "@/types/student";
import { useState } from "react";
import { StudentForm } from "./StudentForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface StudentTableProps {
  students: Student[];
  rooms: { id: string; name: string }[];
  onDeleteStudent: (id: string) => void;
  onUpdateStudent?: (student: Student) => void;
  onTransferStudent?: (studentId: string, newRoomId: string) => void;
  currentRoomId?: string;
}

export function StudentTable({
  students,
  rooms,
  onDeleteStudent,
  onUpdateStudent,
  onTransferStudent,
  currentRoomId,
}: StudentTableProps) {
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const getRoomName = (roomId: string) => {
    const room = rooms.find(room => room.id === roomId);
    return room?.name || "Sala não encontrada";
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
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.birthDate}</TableCell>
              <TableCell>{getRoomName(student.room)}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    student.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {student.status === "active" ? "Ativo" : "Inativo"}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingStudent(student)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteStudent(student.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
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
              onSubmit={(updatedStudent) => {
                if (onUpdateStudent) {
                  onUpdateStudent(updatedStudent);
                }
                setEditingStudent(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}