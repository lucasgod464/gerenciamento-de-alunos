import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { RoomStats } from "@/components/rooms/RoomStats";
import { RoomFilters } from "@/components/rooms/RoomFilters";
import { RoomTable } from "@/components/rooms/RoomTable";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Room, SupabaseRoom, mapSupabaseRoomToRoom } from "@/types/room";
import { RoomActions } from "@/components/rooms/RoomActions";
import { useAuth } from "@/hooks/useAuth";

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchRooms = async () => {
    try {
      const { data: roomsData, error } = await supabase
        .from("rooms")
        .select(`
          *,
          room_authorized_users (
            user_id
          ),
          room_students (
            student:students (
              *
            )
          )
        `);

      if (error) throw error;

      const formattedRooms = (roomsData as SupabaseRoom[]).map(room => 
        mapSupabaseRoomToRoom(room)
      );

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
    fetchRooms();
  }, []);

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setRoomToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleSave = async (room: Partial<Room>) => {
    try {
      if (editingRoom) {
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
          })
          .eq('id', editingRoom.id);

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
          });

        if (createError) throw createError;

        toast({
          title: "Sala criada",
          description: "A sala foi criada com sucesso!",
        });
      }

      fetchRooms();
      setIsDialogOpen(false);
      setEditingRoom(null);
    } catch (error) {
      console.error("Error saving room:", error);
      toast({
        title: "Erro ao salvar sala",
        description: "Ocorreu um erro ao salvar a sala. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!roomToDelete) return;

    try {
      // Delete room_students records first
      const { error: studentsError } = await supabase
        .from('room_students')
        .delete()
        .eq('room_id', roomToDelete);

      if (studentsError) throw studentsError;

      // Delete room_authorized_users records
      const { error: authUsersError } = await supabase
        .from('room_authorized_users')
        .delete()
        .eq('room_id', roomToDelete);

      if (authUsersError) throw authUsersError;

      // Finally delete the room
      const { error: deleteError } = await supabase
        .from('rooms')
        .delete()
        .eq('id', roomToDelete);

      if (deleteError) throw deleteError;

      toast({
        title: "Sala excluída",
        description: "A sala foi excluída com sucesso!",
      });

      fetchRooms();
      setDeleteDialogOpen(false);
      setRoomToDelete(null);
    } catch (error) {
      console.error("Error deleting room:", error);
      toast({
        title: "Erro ao excluir sala",
        description: "Ocorreu um erro ao excluir a sala. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Gerenciamento de Salas</h1>
          <p className="text-muted-foreground">
            Gerencie todas as salas cadastradas no sistema
          </p>
        </div>

        <RoomStats rooms={rooms} />
        <RoomFilters 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={(value) => setStatusFilter(value as "all" | "active" | "inactive")}
        />
        <RoomTable 
          rooms={rooms} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
        <RoomActions
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          editingRoom={editingRoom}
          deleteDialogOpen={deleteDialogOpen}
          setDeleteDialogOpen={setDeleteDialogOpen}
          onSave={handleSave}
          onDeleteConfirm={handleDeleteConfirm}
        />
      </div>
    </DashboardLayout>
  );
};

export default Rooms;