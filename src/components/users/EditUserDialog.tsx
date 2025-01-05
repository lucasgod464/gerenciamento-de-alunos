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
import { useState, useEffect } from "react";
import UserFormFields from "./UserFormFields";

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
  const [selectedTags, setSelectedTags] = useState<{ id: string; name: string; color: string; }[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState<{ id: string; name: string; }[]>([]);

  useEffect(() => {
    if (user && open) {
      setSelectedTags(user.tags || []);
      setSelectedRooms(user.authorizedRooms?.map(room => room.id) || []);
      setSelectedSpecializations(user.specializations || []);
    }
  }, [user, open]);

  const handleUpdateUser = async (formData: FormData) => {
    if (!user) return;

    try {
      setLoading(true);

      const updateData = {
        name: formData.get('name')?.toString() || '',
        email: formData.get('email')?.toString() || '',
        access_level: formData.get('accessLevel')?.toString() as "Admin" | "Usuário Comum",
        location: formData.get('location')?.toString() || '',
        status: formData.get('status')?.toString() || 'active',
        address: formData.get('address')?.toString() || ''
      };

      const { error: updateError } = await supabase
        .from('emails')
        .update(updateData)
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Update user_specializations
      await supabase
        .from('user_specializations')
        .delete()
        .eq('user_id', user.id);

      if (selectedSpecializations.length > 0) {
        await supabase
          .from('user_specializations')
          .insert(selectedSpecializations.map(spec => ({
            user_id: user.id,
            specialization_id: spec.id
          })));
      }

      // Update tags
      await supabase
        .from('user_tags')
        .delete()
        .eq('user_id', user.id);

      if (selectedTags.length > 0) {
        await supabase
          .from('user_tags')
          .insert(selectedTags.map(tag => ({
            user_id: user.id,
            tag_id: tag.id
          })));
      }

      // Update rooms
      const { error: deleteRoomsError } = await supabase
        .from('user_rooms')
        .delete()
        .eq('user_id', user.id);

      if (deleteRoomsError) throw deleteRoomsError;

      if (selectedRooms.length > 0) {
        const { error: insertRoomsError } = await supabase
          .from('user_rooms')
          .insert(selectedRooms.map(roomId => ({
            user_id: user.id,
            room_id: roomId
          })));

        if (insertRoomsError) throw insertRoomsError;
      }

      const updatedUser: User = {
        ...user,
        ...updateData,
        tags: selectedTags,
        authorizedRooms: selectedRooms.map(roomId => ({
          id: roomId,
          name: user.authorizedRooms?.find(r => r.id === roomId)?.name || ''
        })),
        specializations: selectedSpecializations
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
              location: user.location || '',
              status: user.status,
              tags: user.tags,
              accessLevel: user.accessLevel,
              authorizedRooms: user.authorizedRooms,
              address: user.address || '',
              specializations: user.specializations
            }}
            onTagsChange={setSelectedTags}
            onRoomsChange={setSelectedRooms}
            onSpecializationsChange={setSelectedSpecializations}
            isEditing
          />
          <div className="flex justify-end gap-2 sticky bottom-0 bg-white p-4 border-t">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}