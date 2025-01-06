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
      
      if (!user?.companyId) {
        console.error('No company ID found for user');
        setRooms([]);
        return;
      }

      console.log('Fetching rooms for company:', user.companyId);
      
      const { data: roomsData, error } = await supabase
        .from('rooms')
        .select(`
          *,
          companies (
            name
          ),
          room_students (
            student:students (
              id,
              name,
              birth_date,
              status,
              email,
              document,
              address,
              custom_fields,
              company_id,
              created_at
            )
          )
        `)
        .eq('company_id', user.companyId);

      if (error) {
        console.error('Error loading rooms:', error);
        toast({
          title: "Erro ao carregar salas",
          description: "Não foi possível carregar a lista de salas.",
          variant: "destructive",
        });
        return;
      }

      const formattedRooms = (roomsData as unknown as SupabaseRoom[]).map(room => 
        mapSupabaseRoomToRoom(room)
      );

      console.log('Transformed rooms:', formattedRooms);
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
    if (user?.companyId) {
      loadRooms();
    }
  }, [user?.companyId]);

  return {
    rooms,
    loading,
    loadRooms
  };
};