import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";
import { UserFormFields } from "./UserFormFields";
import { useState } from "react";
import { hashPassword } from "@/utils/passwordUtils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface CreateUserDialogProps {
  onUserCreated: (user: User) => void;
}

export function CreateUserDialog({ onUserCreated }: CreateUserDialogProps) {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const handleAuthorizedRoomsChange = (roomIds: string[]) => {
    setSelectedRooms(roomIds);
  };

  const handleTagsChange = (tagIds: string[]) => {
    setSelectedTags(tagIds);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const id = Math.random().toString(36).substr(2, 9);
    const password = formData.get("password") as string;
    const hashedPassword = await hashPassword(password);

    const newUser: User = {
      id,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: hashedPassword,
      responsibleCategory: formData.get("responsibleCategory") as string,
      location: formData.get("location") as string,
      specialization: formData.get("specialization") as string,
      status: formData.get("status") as "active" | "inactive",
      createdAt: new Date().toLocaleDateString(),
      lastAccess: "-",
      companyId: currentUser?.companyId || null,
      authorizedRooms: selectedRooms,
      tags: selectedTags,
    };

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    localStorage.setItem("users", JSON.stringify([...users, newUser]));

    onUserCreated(newUser);
    
    toast({
      title: "Usuário criado",
      description: "O usuário foi criado com sucesso.",
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Criar Usuário</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Usuário</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <UserFormFields 
            onAuthorizedRoomsChange={handleAuthorizedRoomsChange}
            onTagsChange={handleTagsChange}
          />
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="submit">Criar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}