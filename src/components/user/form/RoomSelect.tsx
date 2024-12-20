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

interface RoomSelectProps {
  rooms: Room[];
  selectedRoom: string;
  onRoomChange: (value: string) => void;
}

export const RoomSelect = ({ rooms, selectedRoom, onRoomChange }: RoomSelectProps) => {
  return (
    <Select value={selectedRoom} onValueChange={onRoomChange}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione a sala" />
      </SelectTrigger>
      <SelectContent>
        {rooms.map((room) => (
          <SelectItem key={room.id} value={room.id}>
            {room.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};