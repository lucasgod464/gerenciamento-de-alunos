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

interface RoomTableProps {
  rooms: Room[];
  onEdit: (room: Room) => void;
  onDelete: (id: string) => void;
}

export function RoomTable({ rooms, onEdit, onDelete }: RoomTableProps) {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isStudentsDialogOpen, setIsStudentsDialogOpen] = useState(false);

  const handleShowStudents = (room: Room) => {
    setSelectedRoom(room);
    setIsStudentsDialogOpen(true);
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
              <TableCell>
                {room.authorizedUsers?.length > 0
                  ? room.authorizedUsers.join(", ")
                  : "Nenhum usuário vinculado"}
              </TableCell>
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
        room={selectedRoom}
        isOpen={isStudentsDialogOpen}
        onOpenChange={setIsStudentsDialogOpen}
      />
    </>
  );
}