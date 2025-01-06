import { useState, useEffect } from "react";
import { Room, SupabaseRoom, mapSupabaseRoomToRoom } from "@/types/room";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadRooms = async () => {
    try {
      setLoading(true);
      
      const { data: roomsData, error } = await supabase
        .from('rooms')
        .select(`
          *,
          room_students (
            student:students (*)
          )
        `);

      if (error) throw error;

      const formattedRooms = (roomsData as SupabaseRoom[]).map(room => 
        mapSupabaseRoomToRoom(room)
      );

      setRooms(formattedRooms);
    } catch (error) {
      console.error('Error loading rooms:', error);
      toast({
        title: "Erro ao carregar salas",
        description: "Não foi possível carregar a lista de salas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadRooms();
    }
  }, [user?.id]);

  return {
    rooms,
    loading,
    loadRooms
  };
};