import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { RoomFilters } from "@/components/rooms/RoomFilters";
import { RoomTable } from "@/components/rooms/RoomTable";
import { RoomActions } from "@/components/rooms/RoomActions";
import { useToast } from "@/hooks/use-toast";
import { Room, mapSupabaseRoomToRoom, SupabaseRoom } from "@/types/room";
import { supabase } from "@/integrations/supabase/client";

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  const fetchRooms = async () => {
    if (!currentUser?.companyId) return;

    try {
      const { data: roomsData, error } = await supabase
        .from('rooms')
        .select(`
          *,
          room_authorized_users (
            user_id
          ),
          room_students (
            student_id
          )
        `)
        .eq('company_id', currentUser.companyId);

      if (error) throw error;

      const transformedRooms = (roomsData as SupabaseRoom[]).map(mapSupabaseRoomToRoom);
      setRooms(transformedRooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar as salas",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [currentUser]);

  const handleSave = async (newRoom: Partial<Room>) => {
    if (!currentUser?.companyId) {
      toast({
        title: "Erro",
        description: "Usuário não está associado a uma empresa",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingRoom) {
        // Update existing room
        const { error } = await supabase
          .from('rooms')
          .update({
            name: newRoom.name,
            schedule: newRoom.schedule,
            location: newRoom.location,
            category: newRoom.category,
            status: newRoom.status,
          })
          .eq('id', editingRoom.id);

        if (error) throw error;

        toast({
          title: "Sala atualizada",
          description: "A sala foi atualizada com sucesso.",
        });
      } else {
        // Create new room
        const { error } = await supabase
          .from('rooms')
          .insert({
            name: newRoom.name,
            schedule: newRoom.schedule,
            location: newRoom.location,
            category: newRoom.category,
            status: newRoom.status,
            company_id: currentUser.companyId,
          });

        if (error) throw error;

        toast({
          title: "Sala criada",
          description: "A nova sala foi criada com sucesso.",
        });
      }

      fetchRooms();
      setIsDialogOpen(false);
      setEditingRoom(null);
    } catch (error) {
      console.error('Error saving room:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar a sala",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setRoomToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!roomToDelete || !currentUser?.companyId) return;

    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', roomToDelete);

      if (error) throw error;

      toast({
        title: "Sala excluída",
        description: "A sala foi excluída com sucesso.",
      });

      fetchRooms();
      setDeleteDialogOpen(false);
      setRoomToDelete(null);
    } catch (error) {
      console.error('Error deleting room:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir a sala",
        variant: "destructive",
      });
    }
  };

  const filteredRooms = rooms.filter(room => {
    const searchFields = [
      room.name.toLowerCase(),
      room.schedule.toLowerCase(),
      room.location.toLowerCase(),
      room.category.toLowerCase()
    ];
    
    const matchesSearch = searchTerm === "" || 
      searchFields.some(field => field.includes(searchTerm.toLowerCase()));
      
    const matchesStatus = statusFilter === "all" 
      ? true 
      : statusFilter === "active" ? room.status : !room.status;
      
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Salas</h1>
          <p className="text-muted-foreground">
            Gerencie as salas do sistema
          </p>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Sala
          </Button>
        </div>

        <div className="space-y-4">
          <RoomFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={(value) => setStatusFilter(value as "all" | "active" | "inactive")}
          />

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <RoomTable
              rooms={rooms}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          </div>
        </div>

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
