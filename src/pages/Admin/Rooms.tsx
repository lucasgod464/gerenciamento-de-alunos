import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { RoomDialog } from "@/components/rooms/RoomDialog";
import { RoomFilters } from "@/components/rooms/RoomFilters";
import { RoomTable } from "@/components/rooms/RoomTable";

interface Room {
  id: string;
  name: string;
  schedule: string;
  location: string;
  studyRoom: string;
  capacity: number;
  resources: string;
  status: boolean;
  companyId: string | null;
}

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [studyRoomFilter, setStudyRoomFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.companyId) return;
    
    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    const companyRooms = allRooms.filter((room: Room) => room.companyId === currentUser.companyId);
    setRooms(companyRooms);
  }, [currentUser]);

  const handleSave = (newRoom: Partial<Room>) => {
    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    const otherRooms = allRooms.filter(
      (room: Room) => room.companyId !== currentUser?.companyId
    );

    if (editingRoom) {
      const updatedRooms = rooms.map(room => 
        room.id === editingRoom.id 
          ? { ...editingRoom, ...newRoom }
          : room
      );
      localStorage.setItem("rooms", JSON.stringify([...otherRooms, ...updatedRooms]));
      setRooms(updatedRooms);
    } else {
      const newRoomWithId = { 
        id: Math.random().toString(36).substr(2, 9),
        ...newRoom,
        companyId: currentUser?.companyId
      } as Room;
      const updatedRooms = [...rooms, newRoomWithId];
      localStorage.setItem("rooms", JSON.stringify([...otherRooms, ...updatedRooms]));
      setRooms(updatedRooms);
    }
    
    setIsDialogOpen(false);
    setEditingRoom(null);
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    const otherRooms = allRooms.filter(
      (room: Room) => room.companyId !== currentUser?.companyId || room.id !== id
    );
    
    const updatedRooms = rooms.filter(room => room.id !== id);
    localStorage.setItem("rooms", JSON.stringify([...otherRooms, ...updatedRooms]));
    setRooms(updatedRooms);
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = 
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" 
      ? true 
      : statusFilter === "active" ? room.status : !room.status;
    const matchesStudyRoom = studyRoomFilter === "all" || room.studyRoom === studyRoomFilter;
    return matchesSearch && matchesStatus && matchesStudyRoom;
  });

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Salas</h1>
            <p className="text-muted-foreground">
              Gerencie as salas do sistema
            </p>
          </div>
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
            studyRoomFilter={studyRoomFilter}
            onStudyRoomFilterChange={setStudyRoomFilter}
          />

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <RoomTable
              rooms={filteredRooms}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>

        <RoomDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSave={handleSave}
          editingRoom={editingRoom}
        />
      </div>
    </DashboardLayout>
  );
};

export default Rooms;