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
import { supabase } from "@/integrations/supabase/client";

interface EditUserDialogProps {
  user: User | null;
  onClose: () => void;
  onSubmit: (updatedUser: User) => void;
}

export function EditUserDialog({ user, onClose, onSubmit }: EditUserDialogProps) {
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setSelectedRooms(user.authorizedRooms || []);
      setSelectedTags(user.tags || []);
    }
  }, [user]);

  const handleAuthorizedRoomsChange = (roomIds: string[]) => {
    setSelectedRooms(roomIds);
  };

  const handleTagsChange = (tagIds: string[]) => {
    setSelectedTags(tagIds);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    const formData = new FormData(event.currentTarget);
    const newPassword = formData.get("password") as string;

    try {
      const updateData: any = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        status: formData.get("status") === "active",
      };

      if (newPassword) {
        updateData.password = await hashPassword(newPassword);
      }

      const { data: updatedUser, error: userError } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single();

      if (userError) throw userError;

      await supabase
        .from('user_authorized_rooms')
        .delete()
        .eq('user_id', user.id);

      if (selectedRooms.length > 0) {
        const { error: roomsError } = await supabase
          .from('user_authorized_rooms')
          .insert(
            selectedRooms.map(roomId => ({
              user_id: user.id,
              room_id: roomId
            }))
          );

        if (roomsError) throw roomsError;
      }

      await supabase
        .from('user_tags')
        .delete()
        .eq('user_id', user.id);

      if (selectedTags.length > 0) {
        const { error: tagsError } = await supabase
          .from('user_tags')
          .insert(
            selectedTags.map(tagId => ({
              user_id: user.id,
              tag_id: tagId
            }))
          );

        if (tagsError) throw tagsError;
      }

      onSubmit({
        ...updatedUser,
        authorizedRooms: selectedRooms,
        tags: selectedTags,
        status: updatedUser.status ? 'active' : 'inactive',
      });

      toast({
        title: "Usuário atualizado",
        description: "As informações do usuário foram atualizadas com sucesso.",
      });
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
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
              authorizedRooms: user.authorizedRooms,
              tags: user.tags,
              responsibleCategory: user.responsibleCategory
            }}
            onAuthorizedRoomsChange={handleAuthorizedRoomsChange}
            onTagsChange={handleTagsChange}
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
