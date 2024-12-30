import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Users } from "lucide-react";
import { Room } from "@/types/room";
import { RoomStudentsDialog } from "./RoomStudentsDialog";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Student } from "@/types/student";
import { useToast } from "@/hooks/use-toast";

interface RoomTableProps {
  rooms: Room[];
  onEdit: (room: Room) => void;
  onDelete: (id: string) => void;
}

export function RoomTable({ rooms, onEdit, onDelete }: RoomTableProps) {
  const [selectedRoomStudents, setSelectedRoomStudents] = useState<Student[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [isStudentsDialogOpen, setIsStudentsDialogOpen] = useState(false);
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  const handleShowStudents = (room: Room) => {
    setSelectedRoomStudents(room.students || []);
    setSelectedRoomId(room.id);
    setIsStudentsDialogOpen(true);
  };

  const handleDeleteStudent = (studentId: string) => {
    try {
      // Obter todas as salas do localStorage
      const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
      
      // Encontrar a sala que contém o aluno
      const updatedRooms = allRooms.map((room: Room) => {
        if (room.students) {
          room.students = room.students.filter((student: Student) => student.id !== studentId);
        }
        return room;
      });

      // Atualizar o localStorage com as salas atualizadas
      localStorage.setItem("rooms", JSON.stringify(updatedRooms));

      // Atualizar a lista de alunos selecionados
      setSelectedRoomStudents(prev => prev.filter(student => student.id !== studentId));

      toast({
        title: "Sucesso",
        description: "Aluno excluído com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao excluir aluno:", error);
      toast({
        title: "Erro",
        description: "Erro ao excluir aluno",
        variant: "destructive",
      });
    }
  };

  const handleTransferStudent = (studentId: string, newRoomId: string) => {
    try {
      const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
      let studentToTransfer: Student | null = null;

      // Remover o aluno da sala atual
      const updatedRooms = allRooms.map((room: Room) => {
        if (room.students) {
          const student = room.students.find((s: Student) => s.id === studentId);
          if (student) {
            studentToTransfer = student;
            room.students = room.students.filter((s: Student) => s.id !== studentId);
          }
        }
        return room;
      });

      // Adicionar o aluno à nova sala
      if (studentToTransfer) {
        const targetRoom = updatedRooms.find((room: Room) => room.id === newRoomId);
        if (targetRoom) {
          if (!targetRoom.students) {
            targetRoom.students = [];
          }
          targetRoom.students.push({
            ...studentToTransfer,
            room: newRoomId
          });
        }
      }

      localStorage.setItem("rooms", JSON.stringify(updatedRooms));
      
      // Atualizar a lista de alunos selecionados
      if (selectedRoomId === newRoomId) {
        const newRoomStudents = updatedRooms
          .find((room: Room) => room.id === newRoomId)
          ?.students || [];
        setSelectedRoomStudents(newRoomStudents);
      } else {
        setSelectedRoomStudents(prev => prev.filter(student => student.id !== studentId));
      }

      toast({
        title: "Sucesso",
        description: "Aluno transferido com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao transferir aluno:", error);
      toast({
        title: "Erro",
        description: "Erro ao transferir aluno",
        variant: "destructive",
      });
    }
  };

  const getAuthorizedUserNames = (room: Room) => {
    if (!currentUser?.companyId) return "Nenhum usuário vinculado";

    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const authorizedUsers = allUsers.filter((user: any) => 
      user.companyId === currentUser.companyId && 
      user.authorizedRooms?.includes(room.id)
    );

    if (authorizedUsers.length === 0) return "Nenhum usuário vinculado";
    return authorizedUsers.map(user => user.name).join(", ");
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome da Sala</TableHead>
            <TableHead>Horário</TableHead>
            <TableHead>Endereço</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Usuários Vinculados</TableHead>
            <TableHead>Alunos</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms.map((room) => (
            <TableRow key={room.id}>
              <TableCell>{room.name}</TableCell>
              <TableCell>{room.schedule}</TableCell>
              <TableCell>{room.location}</TableCell>
              <TableCell>{room.category}</TableCell>
              <TableCell>{getAuthorizedUserNames(room)}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShowStudents(room)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Ver Alunos
                </Button>
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    room.status
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {room.status ? "Ativa" : "Inativa"}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(room)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(room.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <RoomStudentsDialog
        open={isStudentsDialogOpen}
        onOpenChange={setIsStudentsDialogOpen}
        students={selectedRoomStudents}
        rooms={rooms}
        currentRoomId={selectedRoomId}
        onDeleteStudent={handleDeleteStudent}
        onTransferStudent={handleTransferStudent}
      />
    </>
  );
}
