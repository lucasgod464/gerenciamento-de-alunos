import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

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
  
  const [newRoom, setNewRoom] = useState({
    name: "",
    schedule: "",
    location: "",
    studyRoom: "",
    capacity: 0,
    resources: "",
    status: true,
  });

  useEffect(() => {
    if (!currentUser?.companyId) return;
    
    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    const companyRooms = allRooms.filter((room: Room) => room.companyId === currentUser.companyId);
    setRooms(companyRooms);
  }, [currentUser]);

  const handleSave = () => {
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
      };
      const updatedRooms = [...rooms, newRoomWithId];
      localStorage.setItem("rooms", JSON.stringify([...otherRooms, ...updatedRooms]));
      setRooms(updatedRooms);
    }
    
    setIsDialogOpen(false);
    setNewRoom({
      name: "",
      schedule: "",
      location: "",
      studyRoom: "",
      capacity: 0,
      resources: "",
      status: true,
    });
    setEditingRoom(null);
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Sala
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingRoom ? "Editar Sala" : "Nova Sala"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Sala</Label>
                  <Input
                    id="name"
                    value={newRoom.name}
                    onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schedule">Horário</Label>
                  <Input
                    id="schedule"
                    value={newRoom.schedule}
                    onChange={(e) => setNewRoom({ ...newRoom, schedule: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Local</Label>
                  <Input
                    id="location"
                    value={newRoom.location}
                    onChange={(e) => setNewRoom({ ...newRoom, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studyRoom">Sala de Estudo</Label>
                  <Select
                    value={newRoom.studyRoom}
                    onValueChange={(value) => setNewRoom({ ...newRoom, studyRoom: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma sala de estudo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="study1">Estudo 1</SelectItem>
                      <SelectItem value="study2">Estudo 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacidade</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={newRoom.capacity}
                    onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resources">Recursos</Label>
                  <Input
                    id="resources"
                    value={newRoom.resources}
                    onChange={(e) => setNewRoom({ ...newRoom, resources: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="status">Status</Label>
                  <Switch
                    id="status"
                    checked={newRoom.status}
                    onCheckedChange={(checked) => setNewRoom({ ...newRoom, status: checked })}
                  />
                  <span className="text-sm text-muted-foreground">
                    {newRoom.status ? "Ativa" : "Inativa"}
                  </span>
                </div>
                <Button onClick={handleSave} className="w-full">
                  Salvar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar salas..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="border rounded-md px-3 py-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
            >
              <option value="all">Todos Status</option>
              <option value="active">Ativas</option>
              <option value="inactive">Inativas</option>
            </select>
            <select
              className="border rounded-md px-3 py-2"
              value={studyRoomFilter}
              onChange={(e) => setStudyRoomFilter(e.target.value)}
            >
              <option value="all">Todas Salas de Estudo</option>
              <option value="study1">Estudo 1</option>
              <option value="study2">Estudo 2</option>
            </select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Sala</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Local</TableHead>
                <TableHead>Sala de Estudo</TableHead>
                <TableHead>Capacidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>{room.name}</TableCell>
                  <TableCell>{room.schedule}</TableCell>
                  <TableCell>{room.location}</TableCell>
                  <TableCell>{room.studyRoom}</TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      room.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {room.status ? "Ativa" : "Inativa"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(room)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(room.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Rooms;
