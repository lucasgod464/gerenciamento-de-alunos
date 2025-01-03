import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserFormFields } from "./UserFormFields";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/user";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CreateUserDialogProps {
  onUserCreated: (user: User) => void;
}

export function CreateUserDialog({ onUserCreated }: CreateUserDialogProps) {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<{ id: string; name: string; color: string; }[]>([]);
  const [open, setOpen] = useState(false);

  const handleAuthorizedRoomsChange = (roomIds: string[]) => {
    setSelectedRooms(roomIds);
  };

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
    const access_level = formData.get("access_level") as "Admin" | "Usuário Comum" || "Usuário Comum";
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
      // Verificar se o email já existe
      const { data: existingEmails, error: checkError } = await supabase
        .from('emails')
        .select('id')
        .eq('email', email);

      if (checkError) throw checkError;

      if (existingEmails && existingEmails.length > 0) {
        toast({
          title: "Erro ao criar usuário",
          description: "Este email já está cadastrado no sistema.",
          variant: "destructive",
        });
        return;
      }

      // Create new user in emails table
      const { data: newUser, error: createError } = await supabase
        .from('emails')
        .insert({
          name,
          email,
          password,
          access_level,
          company_id: currentUser.companyId,
          location,
          specialization,
          status: 'active'
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating user:', createError);
        throw createError;
      }

      if (!newUser) {
        throw new Error('No data returned after creating user');
      }

      // Insert room authorizations
      if (selectedRooms.length > 0) {
        const { error: roomsError } = await supabase
          .from('user_authorized_rooms')
          .insert(
            selectedRooms.map(roomId => ({
              user_id: newUser.id,
              room_id: roomId
            }))
          );

        if (roomsError) {
          console.error('Error creating room authorizations:', roomsError);
          throw roomsError;
        }
      }

      // Insert user tags
      if (selectedTags.length > 0) {
        const { error: tagsError } = await supabase
          .from('user_tags')
          .insert(
            selectedTags.map(tag => ({
              user_id: newUser.id,
              tag_id: tag.id
            }))
          );

        if (tagsError) {
          console.error('Error creating user tags:', tagsError);
          throw tagsError;
        }
      }

      const createdUser: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.access_level === 'Admin' ? 'ADMIN' : 'USER',
        company_id: newUser.company_id,
        created_at: newUser.created_at,
        last_access: null,
        status: 'active',
        access_level: newUser.access_level,
        location: newUser.location || null,
        specialization: newUser.specialization || null,
        authorizedRooms: selectedRooms,
        tags: selectedTags
      };

      onUserCreated(createdUser);
      
      toast({
        title: "Usuário criado",
        description: "O usuário foi criado com sucesso.",
      });

      setOpen(false);
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Erro ao criar usuário",
        description: "Ocorreu um erro ao criar o usuário. Por favor, tente novamente.",
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
            onAuthorizedRoomsChange={handleAuthorizedRoomsChange}
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