import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RoomFormFields } from "./RoomFormFields";
import { Room } from "@/types/room";

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
      category: "",
      status: true,
      studyRoom: "",
      authorizedUsers: []
    }
  );

  useEffect(() => {
    if (editingRoom) {
      setRoom(editingRoom);
    } else {
      setRoom({
        name: "",
        schedule: "",
        location: "",
        category: "",
        status: true,
        studyRoom: "",
        authorizedUsers: []
      });
    }
  }, [editingRoom]);

  const handleFieldChange = (field: keyof Room, value: any) => {
    setRoom((prev) => ({ ...prev, [field]: value }));
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
            Preencha os dados da sala
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <RoomFormFields onChange={handleFieldChange} editingRoom={editingRoom} />
          <Button onClick={handleSave} className="w-full">
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}