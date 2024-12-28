import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { RoomFilters } from "@/components/rooms/RoomFilters";
import { RoomTable } from "@/components/rooms/RoomTable";
import { RoomActions } from "@/components/rooms/RoomActions";
import { useToast } from "@/hooks/use-toast";
import { Room } from "@/types/room";

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

  useEffect(() => {
    // Get all rooms from localStorage, regardless of company
    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    setRooms(allRooms);
  }, []);

  const handleSave = (newRoom: Partial<Room>) => {
    if (!currentUser?.companyId) {
      toast({
        title: "Erro",
        description: "Usuário não está associado a uma empresa",
        variant: "destructive",
      });
      return;
    }

    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");

    if (editingRoom) {
      const updatedRooms = allRooms.map((room: Room) => 
        room.id === editingRoom.id 
          ? { 
              ...editingRoom, 
              ...newRoom,
              studyRoom: editingRoom.studyRoom,
              authorizedUsers: editingRoom.authorizedUsers 
            }
          : room
      );
      localStorage.setItem("rooms", JSON.stringify(updatedRooms));
      setRooms(updatedRooms);
      toast({
        title: "Sala atualizada",
        description: "A sala foi atualizada com sucesso.",
      });
    } else {
      const newRoomWithId = { 
        id: Math.random().toString(36).substr(2, 9),
        ...newRoom,
        companyId: currentUser.companyId,
        studyRoom: "",
        authorizedUsers: [],
        students: []
      } as Room;
      
      const updatedRooms = [...allRooms, newRoomWithId];
      localStorage.setItem("rooms", JSON.stringify(updatedRooms));
      setRooms(updatedRooms);
      toast({
        title: "Sala criada",
        description: "A nova sala foi criada com sucesso.",
      });
    }
    
    setIsDialogOpen(false);
    setEditingRoom(null);
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setRoomToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!roomToDelete) return;

    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    const updatedRooms = allRooms.filter((room: Room) => room.id !== roomToDelete);
    
    localStorage.setItem("rooms", JSON.stringify(updatedRooms));
    setRooms(updatedRooms);
    
    toast({
      title: "Sala excluída",
      description: "A sala foi excluída com sucesso.",
      variant: "destructive",
    });

    setDeleteDialogOpen(false);
    setRoomToDelete(null);
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
              rooms={filteredRooms}
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