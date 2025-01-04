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
import StudentForm from "./StudentForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { StudentTableActions } from "./StudentTableActions";
import { StudentInfoDialog } from "./StudentInfoDialog";

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
  const [isTransferMode, setIsTransferMode] = useState(false);
  const [showingInfo, setShowingInfo] = useState<Student | null>(null);
  const { toast } = useToast();

  const getRoomName = (roomId: string) => {
    const room = rooms.find(room => room.id === roomId);
    return room?.name || "Sala não encontrada";
  };

  const handleEditClick = (student: Student) => {
    if (showTransferOption) {
      setEditingStudent(student);
      setIsTransferMode(true);
    } else {
      setEditingStudent(student);
      setIsTransferMode(false);
    }
  };

  const handleDelete = (studentId: string) => {
    try {
      onDeleteStudent(studentId);
      toast({
        title: "Sucesso",
        description: "Aluno excluído com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir aluno",
        variant: "destructive",
      });
    }
  };

  const handleTransfer = (studentId: string, newRoomId: string) => {
    if (onTransferStudent) {
      onTransferStudent(studentId, newRoomId);
    }
    setEditingStudent(null);
  };

  const handleSubmit = (student: Student) => {
    if (onUpdateStudent) {
      onUpdateStudent(student);
    }
    setEditingStudent(null);
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
              <TableCell>{student.birth_date}</TableCell>
              <TableCell>{getRoomName(student.room || '')}</TableCell>
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
                  onEditClick={handleEditClick}
                  onDeleteClick={handleDelete}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!editingStudent} onOpenChange={() => setEditingStudent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isTransferMode ? "Transferir Aluno" : "Editar Aluno"}
            </DialogTitle>
            <DialogDescription>
              {isTransferMode
                ? "Selecione a sala para onde deseja transferir o aluno"
                : "Edite as informações do aluno"}
            </DialogDescription>
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