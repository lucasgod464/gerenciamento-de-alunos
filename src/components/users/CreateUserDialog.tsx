import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserFormFields } from "./UserFormFields";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/user";
import { useState } from "react";
import { hashPassword } from "@/utils/passwordUtils";
import { supabase } from "@/integrations/supabase/client";

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
    
    try {
      const password = formData.get("password") as string;
      const hashedPassword = await hashPassword(password);

      // Insert new user
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert([{
          name: formData.get("name") as string,
          email: formData.get("email") as string,
          password: hashedPassword,
          role: 'USER',
          company_id: currentUser?.companyId,
          status: true // Default to active
        }])
        .select()
        .single();

      if (userError) throw userError;

      // Insert authorized rooms
      if (selectedRooms.length > 0) {
        const { error: roomsError } = await supabase
          .from('user_authorized_rooms')
          .insert(
            selectedRooms.map(roomId => ({
              user_id: newUser.id,
              room_id: roomId
            }))
          );

        if (roomsError) throw roomsError;
      }

      // Insert user tags
      if (selectedTags.length > 0) {
        const { error: tagsError } = await supabase
          .from('user_tags')
          .insert(
            selectedTags.map(tagId => ({
              user_id: newUser.id,
              tag_id: tagId
            }))
          );

        if (tagsError) throw tagsError;
      }

      onUserCreated({
        ...newUser,
        authorizedRooms: selectedRooms,
        tags: selectedTags,
        status: 'active',
      });
      
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
