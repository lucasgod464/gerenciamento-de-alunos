import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserFormFields } from "./UserFormFields";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/user";
import { useState } from "react";

export function CreateUserDialog() {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);

  const handleAuthorizedRoomsChange = (roomIds: string[]) => {
    setSelectedRooms(roomIds);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const id = Math.random().toString(36).substr(2, 9);

    const newUser: User = {
      id,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      responsibleCategory: formData.get("responsibleCategory") as string,
      location: formData.get("location") as string,
      specialization: formData.get("specialization") as string,
      status: formData.get("status") as "active" | "inactive",
      createdAt: new Date().toLocaleDateString(),
      lastAccess: "-",
      companyId: currentUser?.companyId || null,
      authorizedRooms: selectedRooms,
    };

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    localStorage.setItem("users", JSON.stringify([...users, newUser]));

    toast({
      title: "Usuário criado",
      description: "O usuário foi criado com sucesso.",
    });

    // Fechar o diálogo
    const closeButton = document.querySelector('[data-dialog-close]');
    if (closeButton instanceof HTMLElement) {
      closeButton.click();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Criar Usuário</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Usuário</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <UserFormFields onAuthorizedRoomsChange={handleAuthorizedRoomsChange} />
          <div className="flex justify-end space-x-2">
            <Button type="submit">Criar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}