import { DashboardLayout } from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Room } from "@/types/room";
import { RoomTable } from "@/components/admin/rooms/RoomTable";
import { CreateRoomDialog } from "@/components/admin/rooms/CreateRoomDialog";
import { useToast } from "@/hooks/use-toast";

const RoomsPage = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const { toast } = useToast();

  const loadRooms = async () => {
    try {
      const { data: roomsData, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('company_id', user?.companyId)
        .order('name');

      if (error) throw error;

      if (roomsData) {
        const mappedRooms: Room[] = roomsData.map(room => ({
          id: room.id,
          name: room.name,
          schedule: room.schedule,
          location: room.location,
          category: room.category,
          status: room.status,
          companyId: room.company_id,
          studyRoom: room.study_room,
          createdAt: room.created_at
        }));
        setRooms(mappedRooms);
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

  useEffect(() => {
    if (user?.companyId) {
      loadRooms();
    }
  }, [user?.companyId]);

  const handleDeleteRoom = async (roomId: string) => {
    try {
      const roomToDelete = rooms.find(r => r.id === roomId);
      if (!roomToDelete) return;

      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', roomId);

      if (error) throw error;

      setRooms(prev => prev.filter(room => room.id !== roomId));
      toast({
        title: "Sucesso",
        description: "Sala excluída com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao excluir sala:', error);
      toast({
        title: "Erro ao excluir sala",
        description: "Não foi possível excluir a sala.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateRoom = async (updatedRoom: Room) => {
    try {
      const { error } = await supabase
        .from('rooms')
        .update({
          name: updatedRoom.name,
          schedule: updatedRoom.schedule,
          location: updatedRoom.location,
          category: updatedRoom.category,
          status: updatedRoom.status,
          study_room: updatedRoom.studyRoom
        })
        .eq('id', updatedRoom.id);

      if (error) throw error;

      setRooms(prev =>
        prev.map(room =>
          room.id === updatedRoom.id ? updatedRoom : room
        )
      );

      toast({
        title: "Sucesso",
        description: "Sala atualizada com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao atualizar sala:', error);
      toast({
        title: "Erro ao atualizar sala",
        description: "Não foi possível atualizar a sala.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Salas</h1>
            <p className="text-muted-foreground">
              Gerencie as salas da sua empresa
            </p>
          </div>
          <CreateRoomDialog onRoomCreated={loadRooms} />
        </div>

        <RoomTable
          rooms={rooms}
          onDeleteRoom={handleDeleteRoom}
          onUpdateRoom={handleUpdateRoom}
        />
      </div>
    </DashboardLayout>
  );
};

export default RoomsPage;