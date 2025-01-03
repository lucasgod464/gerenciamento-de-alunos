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
    if (!user?.companyId) {
      console.log("No company ID found for user");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Fetching rooms for company:", user.companyId);
      
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
        .eq('company_id', user.companyId);

      if (error) {
        console.error("Error fetching rooms:", error);
        throw error;
      }

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
    if (!user?.companyId) {
      toast({
        title: "Erro ao salvar sala",
        description: "Usuário não está associado a uma empresa",
        variant: "destructive",
      });
      return;
    }

    try {
      let result;
      
      if (room.id) {
        // Update existing room
        result = await supabase
          .from('rooms')
          .update({
            name: room.name,
            schedule: room.schedule,
            location: room.location,
            category: room.category,
            status: room.status,
            study_room: room.studyRoom || '',
            company_id: user.companyId,
          })
          .eq('id', room.id)
          .select()
          .single();
      } else {
        // Create new room
        result = await supabase
          .from('rooms')
          .insert({
            name: room.name,
            schedule: room.schedule,
            location: room.location,
            category: room.category,
            status: room.status,
            study_room: room.studyRoom || '',
            company_id: user.companyId,
          })
          .select()
          .single();
      }

      if (result.error) throw result.error;

      toast({
        title: room.id ? "Sala atualizada" : "Sala criada",
        description: room.id ? "A sala foi atualizada com sucesso!" : "A sala foi criada com sucesso!",
      });

      fetchRooms();
    } catch (error: any) {
      console.error("Error saving room:", error);
      toast({
        title: "Erro ao salvar sala",
        description: "Ocorreu um erro ao salvar a sala. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirm = async (roomId: string) => {
    if (!roomId || !user?.companyId) return;

    try {
      const { error: deleteError } = await supabase
        .from('rooms')
        .delete()
        .eq('id', roomId);

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