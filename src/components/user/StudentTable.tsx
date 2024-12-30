import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowRight, Pencil, Info } from "lucide-react";
import { Student } from "@/types/student";
import { useState } from "react";
import { StudentForm } from "./StudentForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
                    variant="outline"
                    size="icon"
                    onClick={() => setShowingInfo(student)}
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                  {showTransferOption && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(student)}
                    >
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Transferir Aluno
                    </Button>
                  )}
                  {!showTransferOption && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(student)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(student.id)}
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
              isTransferMode={isTransferMode}
              availableRooms={rooms}
              onTransfer={handleTransfer}
              onSubmit={handleSubmit}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!showingInfo} onOpenChange={() => setShowingInfo(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Informações do Aluno</DialogTitle>
            <DialogDescription>
              Dados fornecidos durante a inscrição
            </DialogDescription>
          </DialogHeader>
          {showingInfo && showingInfo.customFields && (
            <div className="space-y-4">
              {Object.entries(showingInfo.customFields).map(([key, value]) => (
                <div key={key} className="flex flex-col space-y-1.5">
                  <label className="font-semibold capitalize">
                    {key.replace(/_/g, " ")}
                  </label>
                  <p className="text-sm text-muted-foreground">{value}</p>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}