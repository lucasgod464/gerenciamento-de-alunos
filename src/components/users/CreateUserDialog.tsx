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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    
    try {
      // Primeiro, verificar se o email já existe
      const { data: existingEmail } = await supabase
        .from('emails')
        .select('id')
        .eq('email', email)
        .single();

      if (existingEmail) {
        toast({
          title: "Erro ao criar usuário",
          description: "Este email já está cadastrado no sistema.",
          variant: "destructive",
        });
        return;
      }

      // Se o email não existe, prosseguir com a inserção
      const { data: newEmail, error: emailError } = await supabase
        .from('emails')
        .insert([{
          name: formData.get("name") as string,
          email: email,
          password: formData.get("password") as string,
          access_level: 'Usuário Comum',
          company_id: currentUser?.companyId,
        }])
        .select()
        .single();

      if (emailError) {
        console.error('Error creating email:', emailError);
        throw emailError;
      }

      // Inserir autorizações de salas
      if (selectedRooms.length > 0) {
        const { error: roomsError } = await supabase
          .from('user_authorized_rooms')
          .insert(
            selectedRooms.map(roomId => ({
              user_id: newEmail.id,
              room_id: roomId
            }))
          );

        if (roomsError) throw roomsError;
      }

      // Inserir tags do usuário
      if (selectedTags.length > 0) {
        const { error: tagsError } = await supabase
          .from('user_tags')
          .insert(
            selectedTags.map(tag => ({
              user_id: newEmail.id,
              tag_id: tag.id
            }))
          );

        if (tagsError) throw tagsError;
      }

      // Mapear o novo email para o formato User para manter compatibilidade
      const mappedUser: User = {
        id: newEmail.id,
        name: newEmail.name,
        email: newEmail.email,
        role: 'USER',
        companyId: newEmail.company_id,
        authorizedRooms: selectedRooms,
        tags: selectedTags,
        status: 'active',
        createdAt: newEmail.created_at,
      };

      onUserCreated(mappedUser);
      
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
          />
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="submit">Criar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}