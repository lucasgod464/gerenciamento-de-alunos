import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";
import { UserFormFields } from "./UserFormFields";
import { useState, useEffect } from "react";

interface EditUserDialogProps {
  user: User | null;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function EditUserDialog({ user, onClose, onSubmit }: EditUserDialogProps) {
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);

  useEffect(() => {
    if (user?.authorizedRooms) {
      setSelectedRooms(user.authorizedRooms);
    }
  }, [user]);

  if (!user) return null;

  const handleAuthorizedRoomsChange = (roomIds: string[]) => {
    setSelectedRooms(roomIds);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const formData = new FormData(event.currentTarget);
    formData.set("authorizedRooms", JSON.stringify(selectedRooms));
    
    onSubmit(event);
  };

  return (
    <Dialog open={!!user} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <UserFormFields 
            defaultValues={{
              name: user.name,
              email: user.email,
              password: user.password,
              location: user.location,
              specialization: user.specialization,
              status: user.status,
              authorizedRooms: user.authorizedRooms
            }}
            onAuthorizedRoomsChange={handleAuthorizedRoomsChange}
          />
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}