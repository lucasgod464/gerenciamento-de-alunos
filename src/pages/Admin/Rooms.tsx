import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { RoomStats } from "@/components/rooms/RoomStats";
import { RoomFilters } from "@/components/rooms/RoomFilters";
import { RoomTable } from "@/components/rooms/RoomTable";
import { useRooms } from "@/hooks/useRooms";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RoomActions } from "@/components/rooms/RoomActions";
import { Room } from "@/types/room";

export default function AdminRooms() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { rooms, handleSave, handleDeleteConfirm } = useRooms();

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = 
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.location || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || 
                         (filterType === "active" && room.status) ||
                         (filterType === "inactive" && !room.status);
    return matchesSearch && matchesFilter;
  });

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setIsDialogOpen(true);
  };

  const handleDelete = (room: Room) => {
    setEditingRoom(room);
    setDeleteDialogOpen(true);
  };

  return (
    <DashboardLayout role="admin">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col items-center mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Gerenciamento de Salas
          </h1>
          <p className="text-muted-foreground max-w-2xl mb-6">
            Gerencie todas as salas cadastradas no sistema
          </p>
          <Button 
            onClick={() => {
              setEditingRoom(null);
              setIsDialogOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Sala
          </Button>
        </div>

        <div className="space-y-8">
          <RoomStats rooms={rooms} />
          
          <div className="space-y-6">
            <RoomFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filterType={filterType}
              onFilterChange={setFilterType}
            />

            <RoomTable 
              rooms={filteredRooms}
              onEdit={handleEdit}
              onDelete={handleDelete}
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
          onDeleteConfirm={() => {
            if (editingRoom) {
              handleDeleteConfirm(editingRoom.id);
              setDeleteDialogOpen(false);
            }
          }}
        />
      </div>
    </DashboardLayout>
  );
}