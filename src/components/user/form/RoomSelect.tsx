import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

interface Room {
  id: string;
  name: string;
}

interface RoomSelectProps {
  rooms: Room[];
  defaultValue?: string;
  required?: boolean;
}

export const RoomSelect = ({ rooms, defaultValue, required }: RoomSelectProps) => {
  const [selectedRoom, setSelectedRoom] = useState(defaultValue || "");

  useEffect(() => {
    if (defaultValue) {
      setSelectedRoom(defaultValue);
    }
  }, [defaultValue]);

  return (
    <Select 
      value={selectedRoom} 
      onValueChange={setSelectedRoom}
      name="roomId"
      required={required}
    >
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