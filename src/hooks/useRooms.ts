import { useState, useEffect } from "react";
import { Room, SupabaseRoom, mapSupabaseRoomToRoom } from "@/types/room";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchRooms = async () => {
    try {
      console.log("Fetching rooms for company:", user?.companyId);
      const { data: roomsData, error } = await supabase
        .from("rooms")
        .select(`
          *,
          room_authorized_users (
            id,
            user_id,
            is_main_teacher,
            user:users (
              id,
              name,
              email
            )
          )
        `)
        .eq('company_id', user?.companyId);

      if (error) throw error;

      console.log("Rooms data:", roomsData);
      const formattedRooms = (roomsData as SupabaseRoom[]).map(room => 
        mapSupabaseRoomToRoom(room)
      );
      console.log("Transformed rooms:", formattedRooms);

      setRooms(formattedRooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast({
        title: "Erro ao carregar salas",
        description: "Não foi possível carregar as salas. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.companyId) {
      fetchRooms();
    }
  }, [user?.companyId]);

  const handleSave = async (room: Partial<Room>) => {
    try {
      if (room.id) {
        // Update existing room
        const { error: updateError } = await supabase
          .from('rooms')
          .update({
            name: room.name,
            schedule: room.schedule,
            location: room.location,
            category: room.category,
            status: room.status,
            study_room: room.studyRoom || '',
            company_id: user?.companyId
          })
          .eq('id', room.id)
          .select()
          .single();

        if (updateError) throw updateError;

        toast({
          title: "Sala atualizada",
          description: "A sala foi atualizada com sucesso!",
        });
      } else {
        // Create new room
        const { error: createError } = await supabase
          .from('rooms')
          .insert({
            name: room.name,
            schedule: room.schedule,
            location: room.location,
            category: room.category,
            status: room.status,
            study_room: room.studyRoom || '',
            company_id: user?.companyId,
          })
          .select()
          .single();

        if (createError) throw createError;

        toast({
          title: "Sala criada",
          description: "A sala foi criada com sucesso!",
        });
      }

      fetchRooms();
    } catch (error) {
      console.error("Error saving room:", error);
      toast({
        title: "Erro ao salvar sala",
        description: "Ocorreu um erro ao salvar a sala. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirm = async (roomId: string) => {
    if (!roomId) return;

    try {
      const { error: deleteError } = await supabase
        .from('rooms')
        .delete()
        .eq('id', roomId)
        .select()
        .single();

      if (deleteError) throw deleteError;

      toast({
        title: "Sala excluída",
        description: "A sala foi excluída com sucesso!",
      });

      fetchRooms();
    } catch (error) {
      console.error("Error deleting room:", error);
      toast({
        title: "Erro ao excluir sala",
        description: "Ocorreu um erro ao excluir a sala. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return {
    rooms,
    isLoading,
    handleSave,
    handleDeleteConfirm,
  };
}