import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Room } from "@/types/room";

interface RoomSelectorProps {
  rooms: Room[];
  selectedRoom: string;
  onRoomChange: (roomId: string) => void;
}

export const RoomSelector = ({ rooms, selectedRoom, onRoomChange }: RoomSelectorProps) => {
  return (
    <Select value={selectedRoom} onValueChange={onRoomChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Selecionar Sala" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todas as Salas</SelectItem>
        {rooms.map((room) => (
          <SelectItem key={room.id} value={room.id}>
            {room.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};