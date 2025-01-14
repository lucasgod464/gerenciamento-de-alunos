import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RoomSelectProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export const RoomSelect = ({ value, onChange, required = false }: RoomSelectProps) => {
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const loadRooms = async () => {
      if (!currentUser?.id) return;

      try {
        // Fetch only rooms that the user has access to through user_rooms
        const { data, error } = await supabase
          .from('user_rooms')
          .select(`
            room_id,
            rooms (
              id,
              name,
              status
            )
          `)
          .eq('user_id', currentUser.id);

        if (error) throw error;

        // Transform and filter the data to get only active rooms
        const authorizedRooms = data
          .map(item => ({
            id: item.room_id, // Corrected field name here
            name: item.rooms.name
          }))
          .filter(room => room.id && room.name); // Ensure we have valid room data

        setRooms(authorizedRooms);

        // If no value is selected and rooms are available, select the first one
        if (!value && authorizedRooms.length > 0) {
          onChange(authorizedRooms[0].id);
        }
      } catch (error) {
        console.error('Error loading rooms:', error);
      }
    };

    loadRooms();
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
