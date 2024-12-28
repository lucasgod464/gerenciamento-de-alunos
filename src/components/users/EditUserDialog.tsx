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
import { hashPassword } from "@/utils/passwordUtils";
import { useToast } from "@/hooks/use-toast";

interface EditUserDialogProps {
  user: User | null;
  onClose: () => void;
  onSubmit: (updatedUser: User) => void;
}

export function EditUserDialog({ user, onClose, onSubmit }: EditUserDialogProps) {
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (user?.authorizedRooms) {
      setSelectedRooms(user.authorizedRooms);
    }
  }, [user]);

  const handleAuthorizedRoomsChange = (roomIds: string[]) => {
    setSelectedRooms(roomIds);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    const formData = new FormData(event.currentTarget);
    const newPassword = formData.get("password") as string;

    try {
      const updatedUser: User = {
        ...user,
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: newPassword ? await hashPassword(newPassword) : user.password,
        responsibleCategory: formData.get("responsibleCategory") as string,
        location: formData.get("location") as string,
        specialization: formData.get("specialization") as string,
        status: formData.get("status") as "active" | "inactive",
        authorizedRooms: selectedRooms,
      };

      onSubmit(updatedUser);
      toast({
        title: "Usuário atualizado",
        description: "As informações do usuário foram atualizadas com sucesso.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar o usuário.",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

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
              password: "",
              location: user.location,
              specialization: user.specialization,
              status: user.status,
              authorizedRooms: user.authorizedRooms
            }}
            onAuthorizedRoomsChange={handleAuthorizedRoomsChange}
            isEditing={true}
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