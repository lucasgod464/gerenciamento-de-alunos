import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/user";
import { useState } from "react";
import { UserFormFields } from "./UserFormFields";

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: (user: User) => void;
  user: User | null;
}

export function EditUserDialog({
  open,
  onOpenChange,
  onUserUpdated,
  user
}: EditUserDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<{ id: string; name: string; color: string; }[]>(
    user?.tags || []
  );
  const [selectedRooms, setSelectedRooms] = useState<string[]>(
    user?.authorizedRooms?.map(room => room.id) || []
  );

  const handleUpdateUser = async (formData: FormData) => {
    if (!user) return;

    try {
      setLoading(true);

      const updateData = {
        name: formData.get('name')?.toString() || '',
        email: formData.get('email')?.toString() || '',
        access_level: formData.get('accessLevel')?.toString() as "Admin" | "Usuário Comum",
        location: formData.get('location')?.toString() || '',
        specialization: formData.get('specialization')?.toString() || '',
        status: formData.get('status')?.toString() || 'active'
      };

      const { error: updateError } = await supabase
        .from('emails')
        .update(updateData)
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Update tags
      await supabase
        .from('user_tags')
        .delete()
        .eq('user_id', user.id);

      if (selectedTags.length > 0) {
        const tagInserts = selectedTags.map(tag => ({
          user_id: user.id,
          tag_id: tag.id
        }));

        await supabase
          .from('user_tags')
          .insert(tagInserts);
      }

      // Update rooms
      await supabase
        .from('user_rooms')
        .delete()
        .eq('user_id', user.id);

      if (selectedRooms.length > 0) {
        const roomInserts = selectedRooms.map(roomId => ({
          user_id: user.id,
          room_id: roomId
        }));

        await supabase
          .from('user_rooms')
          .insert(roomInserts);
      }

      const updatedUser: User = {
        ...user,
        name: updateData.name,
        email: updateData.email,
        role: updateData.access_level,
        location: updateData.location,
        specialization: updateData.specialization,
        status: updateData.status,
        tags: selectedTags,
        accessLevel: updateData.access_level,
        authorizedRooms: selectedRooms.map(roomId => ({ id: roomId, name: '' }))
      };

      toast({
        title: "Usuário atualizado",
        description: "O usuário foi atualizado com sucesso.",
      });

      onUserUpdated(updatedUser);
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Erro ao atualizar usuário",
        description: "Ocorreu um erro ao atualizar o usuário.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleUpdateUser(new FormData(e.currentTarget));
        }} className="space-y-4">
          <UserFormFields
            defaultValues={{
              name: user.name,
              email: user.email,
              specialization: user.specialization || '',
              location: user.location || '',
              status: user.status,
              tags: user.tags,
              accessLevel: user.accessLevel,
              authorizedRooms: user.authorizedRooms
            }}
            onTagsChange={setSelectedTags}
            onRoomsChange={setSelectedRooms}
            isEditing
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}