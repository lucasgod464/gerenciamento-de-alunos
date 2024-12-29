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

  const handleShowStudents = (room: Room) => {
    setSelectedRoomStudents(room.students || []);
    setSelectedRoomId(room.id);
    setIsStudentsDialogOpen(true);
  };

  const handleDeleteStudent = (studentId: string) => {
    // Implementation for deleting student
    console.log("Delete student:", studentId);
  };

  const handleTransferStudent = (studentId: string, newRoomId: string) => {
    // Implementation for transferring student
    console.log("Transfer student:", studentId, "to room:", newRoomId);
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