import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { RoomFormFields } from "./RoomFormFields";
import { AuthorizedUsersList } from "./AuthorizedUsersList";

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
  authorizedUsers: string[];
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

  // Atualiza o estado do room quando editingRoom muda
  useEffect(() => {
    if (editingRoom) {
      console.log("Editing room data:", editingRoom); // Debug log
      setRoom(editingRoom);
    } else {
      setRoom({
        name: "",
        schedule: "",
        location: "",
        studyRoom: "",
        capacity: 0,
        resources: "",
        status: true,
        authorizedUsers: [],
      });
    }
  }, [editingRoom]);

  const handleFieldChange = (field: keyof Room, value: any) => {
    setRoom((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddUser = (userId: string) => {
    const currentUsers = room.authorizedUsers || [];
    if (!currentUsers.includes(userId)) {
      handleFieldChange("authorizedUsers", [...currentUsers, userId]);
    }
  };

  const handleRemoveUser = (userId: string) => {
    const currentUsers = room.authorizedUsers || [];
    handleFieldChange(
      "authorizedUsers",
      currentUsers.filter((id) => id !== userId)
    );
  };

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
          <RoomFormFields room={room} onChange={handleFieldChange} />
          <AuthorizedUsersList
            users={users}
            authorizedUsers={room.authorizedUsers || []}
            onAddUser={handleAddUser}
            onRemoveUser={handleRemoveUser}
          />
          <Button onClick={handleSave} className="w-full">
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}