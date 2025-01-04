import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserFormFields } from "./UserFormFields";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/user";
import { useState } from "react";
import { userService } from "@/services/userService";

interface CreateUserDialogProps {
  onUserCreated: (user: User) => void;
}

export function CreateUserDialog({ onUserCreated }: CreateUserDialogProps) {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [selectedTags, setSelectedTags] = useState<{ id: string; name: string; color: string; }[]>([]);
  const [open, setOpen] = useState(false);

  const handleTagsChange = (tags: { id: string; name: string; color: string; }[]) => {
    setSelectedTags(tags);
  };

  const generateStrongPassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    
    const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;
    if (passwordInput) {
      passwordInput.value = password;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;
    const accessLevel = formData.get("access_level") as "Admin" | "Usuário Comum" || "Usuário Comum";
    const location = formData.get("address") as string;
    const specialization = formData.get("specialization") as string;
    
    if (!email || !name || !password || !currentUser?.companyId) {
      toast({
        title: "Erro ao criar usuário",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      const user = await userService.createUser({
        email,
        name,
        password,
        accessLevel,
        companyId: currentUser.companyId,
        location,
        specialization,
        status: 'active',
        role: 'USER',
        selectedTags
      });

      onUserCreated(user);
      
      toast({
        title: "Usuário criado",
        description: "O usuário foi criado com sucesso.",
      });

      setOpen(false);
    } catch (error: any) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Erro ao criar usuário",
        description: error.message || "Ocorreu um erro ao criar o usuário. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
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
          <UserFormFields 
            onTagsChange={handleTagsChange}
            generateStrongPassword={generateStrongPassword}
          />
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="submit">Criar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}