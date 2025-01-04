import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { RoomStats } from "@/components/rooms/RoomStats";
import { RoomFilters } from "@/components/rooms/RoomFilters";
import { RoomTable } from "@/components/rooms/RoomTable";
import { useRooms } from "@/hooks/useRooms";
import { RoomActions } from "@/components/rooms/RoomActions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Room } from "@/types/room";

const Rooms = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const { rooms, isLoading, handleSave, handleDeleteConfirm } = useRooms();

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setRoomToDelete(id);
    setDeleteDialogOpen(true);
  };

  const onDeleteConfirm = () => {
    if (roomToDelete) {
      handleDeleteConfirm(roomToDelete);
      setDeleteDialogOpen(false);
      setRoomToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-full">
          <span className="text-muted-foreground">Carregando...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Gerenciamento de Salas</h1>
            <p className="text-muted-foreground">
              Gerencie todas as salas cadastradas no sistema
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Sala
          </Button>
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
          onDeleteConfirm={onDeleteConfirm}
        />
      </div>
    </DashboardLayout>
  );
};

export default Rooms;