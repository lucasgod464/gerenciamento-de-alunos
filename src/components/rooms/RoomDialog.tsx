import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  authorizedUsers: string[]; // Array of user IDs
}

interface RoomDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (room: Partial<Room>) => void;
  editingRoom: Room | null;
}

export function RoomDialog({ isOpen, onOpenChange, onSave, editingRoom }: RoomDialogProps) {
  const [room, setRoom] = useState<Partial<Room>>(
    editingRoom || {
      name: "",
      schedule: "",
      location: "",
      studyRoom: "",
      capacity: 0,
      resources: "",
      status: true,
      authorizedUsers: [],
    }
  );
  const [users, setUsers] = useState<Array<{ id: string; name: string }>>([]);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.companyId) return;
    
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const companyUsers = allUsers.filter(
      (user: any) => user.companyId === currentUser.companyId
    );
    setUsers(companyUsers);
  }, [currentUser]);

  const handleSave = () => {
    onSave(room);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingRoom ? "Editar Sala" : "Nova Sala"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados da sala e selecione os usuários autorizados
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Sala</Label>
            <Input
              id="name"
              value={room.name}
              onChange={(e) => setRoom({ ...room, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="schedule">Horário</Label>
            <Input
              id="schedule"
              value={room.schedule}
              onChange={(e) => setRoom({ ...room, schedule: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Local</Label>
            <Input
              id="location"
              value={room.location}
              onChange={(e) => setRoom({ ...room, location: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="studyRoom">Sala de Estudo</Label>
            <Select
              value={room.studyRoom}
              onValueChange={(value) => setRoom({ ...room, studyRoom: value })}
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
              value={room.capacity}
              onChange={(e) => setRoom({ ...room, capacity: parseInt(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resources">Recursos</Label>
            <Input
              id="resources"
              value={room.resources}
              onChange={(e) => setRoom({ ...room, resources: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Usuários Autorizados</Label>
            <Select
              value=""
              onValueChange={(userId) => {
                const currentUsers = room.authorizedUsers || [];
                if (!currentUsers.includes(userId)) {
                  setRoom({
                    ...room,
                    authorizedUsers: [...currentUsers, userId],
                  });
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione os usuários" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Lista de usuários selecionados */}
            <div className="mt-2 space-y-2">
              {room.authorizedUsers?.map((userId) => {
                const user = users.find((u) => u.id === userId);
                return user ? (
                  <div key={userId} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                    <span>{user.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setRoom({
                          ...room,
                          authorizedUsers: room.authorizedUsers?.filter((id) => id !== userId) || [],
                        });
                      }}
                    >
                      Remover
                    </Button>
                  </div>
                ) : null;
              })}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="status">Status</Label>
            <Switch
              id="status"
              checked={room.status}
              onCheckedChange={(checked) => setRoom({ ...room, status: checked })}
            />
            <span className="text-sm text-muted-foreground">
              {room.status ? "Ativa" : "Inativa"}
            </span>
          </div>
          <Button onClick={handleSave} className="w-full">
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}