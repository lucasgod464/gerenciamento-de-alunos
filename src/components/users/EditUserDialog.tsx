import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserFormFields } from "./UserFormFields";
import { User } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

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
  const [selectedTags, setSelectedTags] = useState<{ id: string; name: string; color: string; }[]>(
    user?.tags || []
  );

  const handleUpdateUser = async (formData: FormData) => {
    if (!user) return;

    try {
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
      const { error: deleteTagsError } = await supabase
        .from('user_tags')
        .delete()
        .eq('user_id', user.id);

      if (deleteTagsError) throw deleteTagsError;

      if (selectedTags.length > 0) {
        const tagInserts = selectedTags.map(tag => ({
          user_id: user.id,
          tag_id: tag.id
        }));

        const { error: insertTagsError } = await supabase
          .from('user_tags')
          .insert(tagInserts);

        if (insertTagsError) throw insertTagsError;
      }

      const updatedUser: User = {
        ...user,
        name: updateData.name,
        email: updateData.email,
        role: updateData.access_level,
        location: updateData.location,
        specialization: updateData.specialization,
        status: updateData.status as "active" | "inactive",
        tags: selectedTags
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
              tags: user.tags
            }}
            onTagsChange={setSelectedTags}
            isEditing
          />
          <div className="flex justify-end">
            <button type="submit" className="btn-primary">
              Salvar Alterações
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}