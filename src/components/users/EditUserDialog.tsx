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
    const isActive = formData.get("status") === "active";

    try {
      // Update user in emails table
      const { data: updatedUser, error: updateError } = await supabase
        .from('emails')
        .update({
          name: formData.get("name") as string,
          email: formData.get("email") as string,
          location: formData.get("location") as string,
          specialization: formData.get("specialization") as string,
          access_level: isActive ? "Usuário Comum" : "Inativo",
        })
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Update user's authorized rooms
      if (selectedRooms.length > 0) {
        // First, remove existing room authorizations
        await supabase
          .from('user_authorized_rooms')
          .delete()
          .eq('user_id', user.id);

        // Then, add new room authorizations
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

      // Update user tags
      if (selectedTags.length > 0) {
        // Remove existing tags
        await supabase
          .from('user_tags')
          .delete()
          .eq('user_id', user.id);

        // Add new tags
        const { error: tagsError } = await supabase
          .from('user_tags')
          .insert(
            selectedTags.map(tag => ({
              user_id: user.id,
              tag_id: tag.id
            }))
          );

        if (tagsError) throw tagsError;
      }

      if (updatedUser) {
        const mappedUser: User = {
          ...user,
          name: updatedUser.name,
          email: updatedUser.email,
          location: updatedUser.location,
          specialization: updatedUser.specialization,
          role: updatedUser.access_level === 'Admin' ? 'ADMIN' : 'USER',
          status: updatedUser.access_level === 'Inativo' ? 'inactive' : 'active',
          authorizedRooms: selectedRooms,
          tags: selectedTags,
        };

        onSubmit(mappedUser);
        toast({
          title: "Usuário atualizado",
          description: "As informações do usuário foram atualizadas com sucesso.",
        });
        onClose();
      }
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
              location: user.location,
              specialization: user.specialization,
              status: user.status,
              authorizedRooms: selectedRooms,
              tags: selectedTags,
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