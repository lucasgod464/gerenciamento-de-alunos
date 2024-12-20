import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
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
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export const RoomSelect = ({ value, onChange, required = false }: RoomSelectProps) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.companyId) return;
    
    const storedRooms = localStorage.getItem("rooms");
    if (storedRooms) {
      const allRooms = JSON.parse(storedRooms);
      const companyRooms = allRooms.filter(
        (room: Room) => room.companyId === currentUser.companyId
      );
      setRooms(companyRooms);
      if (!value && companyRooms.length > 0) {
        onChange(companyRooms[0].id);
      }
    }
  }, [currentUser, value, onChange]);

  return (
    <Select value={value} onValueChange={onChange} required={required}>
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