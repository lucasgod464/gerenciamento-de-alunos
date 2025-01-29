import { useState } from "react";
import { Room } from "@/types/room";
import { RoomFilters } from "@/components/rooms/RoomFilters";
import { RoomDialog } from "@/components/rooms/RoomDialog";
import { RoomTable } from "@/components/rooms/RoomTable";
import { useRooms } from "@/hooks/useRooms";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function Rooms() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { rooms, loading, handleSave, handleDeleteConfirm } = useRooms();
  const { toast } = useToast();

  const handleSaveRoom = async (roomData: Partial<Room>) => {
    try {
      await handleSave(roomData);
      setIsDialogOpen(false);
      setEditingRoom(null);
      toast({
        title: editingRoom ? "Sala atualizada" : "Sala adicionada",
        description: editingRoom 
          ? "A sala foi atualizada com sucesso."
          : "A nova sala foi adicionada com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao salvar sala:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar a sala.",
        variant: "destructive",
      });
    }
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setIsDialogOpen(true);
  };

  const handleDeleteRoom = async (roomId: string) => {
    try {
      await handleDeleteConfirm(roomId);
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
    <DashboardLayout role="admin">
      <div className="space-y-4 p-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Salas</h1>
          <p className="text-muted-foreground">
            Gerencie todas as salas da sua instituição, adicione novas salas ou edite as existentes.
          </p>
        </div>

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
    </DashboardLayout>
  );
}