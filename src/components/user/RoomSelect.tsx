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
      if (!currentUser?.companyId) return;

      try {
        const { data, error } = await supabase
          .from('rooms')
          .select('id, name')
          .eq('company_id', currentUser.companyId)
          .eq('status', true);

        if (error) throw error;
        setRooms(data || []);

        // If no value is selected and rooms are available, select the first one
        if (!value && data && data.length > 0) {
          onChange(data[0].id);
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