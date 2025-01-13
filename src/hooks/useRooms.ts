import { useState, useEffect } from "react";
import { Room } from "@/types/room";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const loadRooms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('rooms')
        .select(`
          *,
          room_students (
            student_id,
            students (*)
          )
        `)
        .eq('company_id', user?.companyId);

      if (error) throw error;

      const mappedRooms = data.map((room) => ({
        id: room.id,
        name: room.name,
        schedule: room.schedule,
        location: room.location,
        category: room.category,
        status: room.status,
        companyId: room.company_id,
        studyRoom: room.study_room,
        createdAt: room.created_at,
        students: room.room_students?.map((rs: any) => rs.students) || []
      }));

      setRooms(mappedRooms);
    } catch (error) {
      console.error('Error loading rooms:', error);
      toast({
        title: "Erro ao carregar salas",
        description: "Não foi possível carregar as salas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (room: Partial<Room>) => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .upsert({
          id: room.id,
          name: room.name,
          schedule: room.schedule,
          location: room.location,
          category: room.category,
          status: room.status,
          company_id: user?.companyId,
          study_room: room.studyRoom
        })
        .select()
        .single();

      if (error) throw error;

      await loadRooms();
      
      toast({
        title: "Sucesso",
        description: room.id ? "Sala atualizada com sucesso!" : "Sala criada com sucesso!",
      });
    } catch (error) {
      console.error('Error saving room:', error);
      toast({
        title: "Erro ao salvar sala",
        description: "Não foi possível salvar a sala.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirm = async (id: string) => {
    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadRooms();
      
      toast({
        title: "Sucesso",
        description: "Sala removida com sucesso!",
      });
    } catch (error) {
      console.error('Error deleting room:', error);
      toast({
        title: "Erro ao remover sala",
        description: "Não foi possível remover a sala.",
        variant: "destructive",
      });
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
    loadRooms,
    handleSave,
    handleDeleteConfirm
  };
};
