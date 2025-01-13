import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useRoomData = (userId: string | undefined) => {
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const { toast } = useToast();

  const loadRooms = async () => {
    if (!userId) return;

    try {
      const { data: userRooms, error: roomsError } = await supabase
        .from('user_rooms')
        .select(`
          room:rooms (
            id,
            name
          )
        `)
        .eq('user_id', userId);

      if (roomsError) throw roomsError;

      if (userRooms) {
        const formattedRooms = userRooms
          .map(ur => ur.room)
          .filter(room => room !== null);
        setRooms(formattedRooms);
      }
    } catch (error) {
      console.error('Erro ao carregar salas:', error);
      toast({
        title: "Erro ao carregar salas",
        description: "Não foi possível carregar a lista de salas.",
        variant: "destructive",
      });
    }
  };

  return {
    rooms,
    loadRooms,
  };
};
