import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserFormFields } from "./UserFormFields";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/user";
import { useState } from "react";

interface CreateUserDialogProps {
  onUserCreated: (user: User) => void;
}

export function CreateUserDialog({ onUserCreated }: CreateUserDialogProps) {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const handleAuthorizedRoomsChange = (roomIds: string[]) => {
    setSelectedRooms(roomIds);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const id = Math.random().toString(36).substr(2, 9);
    const email = formData.get("email") as string;

    // Criar entrada no createdEmails para autenticação
    const emailEntry = {
      id,
      name: formData.get("name") as string,
      email: email,
      password: "123456", // Senha padrão
      accessLevel: "Usuário Comum",
      company: currentUser?.companyId || "",
      createdAt: new Date().toLocaleDateString(),
    };

    const createdEmails = JSON.parse(localStorage.getItem("createdEmails") || "[]");
    localStorage.setItem("createdEmails", JSON.stringify([...createdEmails, emailEntry]));

    // Criar o usuário
    const newUser: User = {
      id,
      name: formData.get("name") as string,
      email: email,
      responsibleCategory: formData.get("responsibleCategory") as string,
      location: formData.get("location") as string,
      specialization: formData.get("specialization") as string,
      status: formData.get("status") as "active" | "inactive",
      createdAt: new Date().toLocaleDateString(),
      lastAccess: "-",
      companyId: currentUser?.companyId || null,
      authorizedRooms: selectedRooms,
    };

    console.log("Criando novo usuário:", newUser);
    console.log("Criando entrada de email:", emailEntry);

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    localStorage.setItem("users", JSON.stringify([...users, newUser]));

    onUserCreated(newUser);
    
    toast({
      title: "Usuário criado",
      description: "O usuário foi criado com sucesso. A senha padrão é: 123456",
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Criar Usuário</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Criar Usuário</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <UserFormFields onAuthorizedRoomsChange={handleAuthorizedRoomsChange} />
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="submit">Criar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}