import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Room {
  id: string;
  name: string;
}

interface RoomSelectorProps {
  rooms: Room[];
  selectedRoom: string;
  onRoomChange: (roomId: string) => void;
  className?: string;
}

export const RoomSelector = ({ rooms, selectedRoom, onRoomChange, className }: RoomSelectorProps) => {
  return (
    <Select value={selectedRoom} onValueChange={onRoomChange} className={className}>
      <SelectTrigger>
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
