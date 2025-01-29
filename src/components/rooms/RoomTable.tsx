import { Room } from "@/types/room";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RoomTableRow } from "./table/RoomTableRow";

export interface RoomTableProps {
  rooms: Room[];
  onDelete: (id: string) => void;
  onEdit: (room: Room) => void;
}

export function RoomTable({ rooms, onDelete, onEdit }: RoomTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Nome</TableHead>
          <TableHead>Horário</TableHead>
          <TableHead>Local</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rooms.map((room) => (
          <RoomTableRow
            key={room.id}
            room={room}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
        {rooms.length === 0 && (
          <TableRow>
            <TableHead colSpan={5} className="text-center h-24 text-muted-foreground">
              Nenhuma sala encontrada
            </TableHead>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}