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
  const [selectedTags, setSelectedTags] = useState<{ id: string; name: string; color: string; }[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      const fetchUserDetails = async () => {
        try {
          // Fetch authorized rooms
          const { data: roomData } = await supabase
            .from('user_authorized_rooms')
            .select('room_id')
            .eq('user_id', user.id);
          
          if (roomData) {
            setSelectedRooms(roomData.map(r => r.room_id));
          }

          // Fetch user tags
          const { data: tagData } = await supabase
            .from('user_tags')
            .select(`
              tags (
                id,
                name,
                color
              )
            `)
            .eq('user_id', user.id);

          if (tagData) {
            setSelectedTags(tagData.map(t => t.tags).filter(Boolean));
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
          toast({
            title: "Erro ao carregar dados",
            description: "Não foi possível carregar todos os dados do usuário.",
            variant: "destructive",
          });
        }
      };

      fetchUserDetails();
    }
  }, [user, toast]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    const formData = new FormData(event.currentTarget);

    try {
      const updateData: any = {
        name: formData.get("name"),
        email: formData.get("email"),
        location: formData.get("location"),
        specialization: formData.get("specialization"),
        status: formData.get("status") === "active",
        responsible_category: formData.get("responsibleCategory"),
      };

      const newPassword = formData.get("password") as string;
      if (newPassword) {
        updateData.password = await hashPassword(newPassword);
      }

      // Update user basic info
      const { data: updatedUser, error: userError } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single();

      if (userError) throw userError;

      // Update authorized rooms
      await supabase
        .from('user_authorized_rooms')
        .delete()
        .eq('user_id', user.id);

      if (selectedRooms.length > 0) {
        await supabase
          .from('user_authorized_rooms')
          .insert(
            selectedRooms.map(roomId => ({
              user_id: user.id,
              room_id: roomId
            }))
          );
      }

      // Update user tags
      await supabase
        .from('user_tags')
        .delete()
        .eq('user_id', user.id);

      if (selectedTags.length > 0) {
        await supabase
          .from('user_tags')
          .insert(
            selectedTags.map(tag => ({
              user_id: user.id,
              tag_id: tag.id
            }))
          );
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
              authorizedRooms: selectedRooms,
              tags: selectedTags,
              responsibleCategory: user.responsibleCategory
            }}
            onAuthorizedRoomsChange={setSelectedRooms}
            onTagsChange={setSelectedTags}
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