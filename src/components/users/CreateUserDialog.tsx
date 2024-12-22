import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserFormFields } from "./UserFormFields";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/user";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";

interface CreateUserDialogProps {
  onUserCreated: (user: User) => void;
}

export function CreateUserDialog({ onUserCreated }: CreateUserDialogProps) {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const methods = useForm();

  const handleAuthorizedRoomsChange = (roomIds: string[]) => {
    setSelectedRooms(roomIds);
  };

  const handleSubmit = (data: any) => {
    const id = Math.random().toString(36).substr(2, 9);
    const finalPassword = password || "";

    const newUser: User = {
      id,
      name: data.name,
      email: data.email,
      password: finalPassword,
      responsibleCategory: data.responsibleCategory,
      location: data.location,
      specialization: data.specialization,
      status: data.status || "active",
      createdAt: new Date().toLocaleDateString(),
      lastAccess: "-",
      companyId: currentUser?.companyId || null,
      authorizedRooms: selectedRooms,
    };

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    localStorage.setItem("users", JSON.stringify([...users, newUser]));

    onUserCreated(newUser);
    
    toast({
      title: "Usuário criado",
      description: `O usuário foi criado com sucesso. Senha: ${finalPassword}`,
    });

    setOpen(false);
    setPassword("");
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
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-4">
            <UserFormFields 
              onAuthorizedRoomsChange={handleAuthorizedRoomsChange}
              password={password}
              onPasswordChange={setPassword}
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="submit">Criar</Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}