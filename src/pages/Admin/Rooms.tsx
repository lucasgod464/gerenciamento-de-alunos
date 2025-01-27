import { useState } from "react";
import { Room } from "@/types/room";
import { RoomFilters } from "@/components/rooms/RoomFilters";
import { RoomDialog } from "@/components/rooms/RoomDialog";
import { RoomTable } from "@/components/rooms/RoomTable";
import { useRooms } from "@/hooks/useRooms";
import { useToast } from "@/hooks/use-toast";

export default function Rooms() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Partial<Room> | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<boolean | null>(null);
  const { rooms, loading, addRoom, updateRoom, deleteRoom } = useRooms();
  const { toast } = useToast();

  const handleSaveRoom = async (roomData: Partial<Room>) => {
    try {
      if (editingRoom) {
        await updateRoom({ ...editingRoom, ...roomData });
        toast({
          title: "Sala atualizada",
          description: "A sala foi atualizada com sucesso.",
        });
      } else {
        await addRoom(roomData);
        toast({
          title: "Sala adicionada",
          description: "A nova sala foi adicionada com sucesso.",
        });
      }
      setIsDialogOpen(false);
      setEditingRoom(null);
    } catch (error) {
      console.error("Erro ao salvar sala:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar a sala.",
        variant: "destructive",
      });
    }
  };

  const handleEditRoom = async (room: Room) => {
    setEditingRoom(room);
    setIsDialogOpen(true);
  };

  const handleDeleteRoom = async (roomId: string) => {
    try {
      await deleteRoom(roomId);
      toast({
        title: "Sala removida",
        description: "A sala foi removida com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao excluir sala:", error);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir a sala.",
        variant: "destructive",
      });
    }
  };

  const handleAddRoom = () => {
    setEditingRoom(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4 p-8">
      <RoomFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onAddRoom={handleAddRoom}
      />

      <RoomDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingRoom={editingRoom}
        onSave={handleSaveRoom}
      />

      <RoomTable
        rooms={rooms}
        onDelete={handleDeleteRoom}
        onEdit={handleEditRoom}
      />
    </div>
  );
}