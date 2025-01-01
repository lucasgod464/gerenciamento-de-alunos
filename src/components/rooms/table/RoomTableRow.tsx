import { Room } from "@/types/room";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Users } from "lucide-react";

interface RoomTableRowProps {
  room: Room;
  onEdit: (room: Room) => void;
  onDelete: (id: string) => void;
  onShowStudents: (room: Room) => void;
  getAuthorizedUserNames: (room: Room) => string;
}

export const RoomTableRow = ({
  room,
  onEdit,
  onDelete,
  onShowStudents,
  getAuthorizedUserNames,
}: RoomTableRowProps) => {
  return (
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
          onClick={() => onShowStudents(room)}
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
  );
};