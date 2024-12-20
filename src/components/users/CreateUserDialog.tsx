import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types/user";
import { useAuth } from "@/hooks/useAuth";
import { UserFormFields } from "./UserFormFields";

interface CreateUserDialogProps {
  onUserCreated: (user: User) => void;
}

export function CreateUserDialog({ onUserCreated }: CreateUserDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  const generateUniqueId = () => {
    return Math.floor(100000000 + Math.random() * 900000000).toString();
  };

  const generateStrongPassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const uniqueId = generateUniqueId();
    const newUser: User = {
      id: uniqueId,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      responsibleCategory: formData.get("responsibleCategory") as string,
      location: formData.get("location") as string,
      specialization: formData.get("specialization") as string,
      status: formData.get("status") as "active" | "inactive",
      createdAt: new Date().toLocaleDateString(),
      lastAccess: "-",
      companyId: currentUser?.companyId || null,
    };
    
    onUserCreated(newUser);
    setOpen(false);
    toast({
      title: "Usuário criado",
      description: "O usuário foi criado com sucesso.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Novo Usuário</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Usuário</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para criar um novo usuário no sistema.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <UserFormFields generateStrongPassword={generateStrongPassword} />
          <Button type="submit" className="w-full">
            Criar Usuário
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}