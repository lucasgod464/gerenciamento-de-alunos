import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserFormFields } from "./UserFormFields";
import { User } from "@/types/user";

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
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [currentTags, setCurrentTags] = useState<Array<{ id: string; name: string; color: string }>>([]);

  useEffect(() => {
    const fetchUserTags = async () => {
      if (!user?.id) return;

      try {
        const { data: userTags, error } = await supabase
          .from('user_tags')
          .select(`
            tags (
              id,
              name,
              color
            )
          `)
          .eq('user_id', user.id);

        if (error) throw error;

        if (userTags) {
          setCurrentTags(userTags.map(ut => ut.tags).filter(Boolean));
        }
      } catch (error) {
        console.error('Error fetching user tags:', error);
      }
    };

    fetchUserTags();
  }, [user]);

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
      const selectedTags = JSON.parse(formData.get('tags')?.toString() || '[]');
      
      // Remove existing tags
      const { error: deleteTagsError } = await supabase
        .from('user_tags')
        .delete()
        .eq('user_id', user.id);

      if (deleteTagsError) throw deleteTagsError;

      // Add new tags
      if (selectedTags.length > 0) {
        const userTagsToInsert = selectedTags.map((tag: { id: string }) => ({
          user_id: user.id,
          tag_id: tag.id,
        }));

        const { error: insertTagsError } = await supabase
          .from('user_tags')
          .insert(userTagsToInsert);

        if (insertTagsError) throw insertTagsError;
      }

      const updatedUser: User = {
        ...user,
        name: updateData.name,
        email: updateData.email,
        accessLevel: updateData.access_level,
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
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
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
              accessLevel: user.accessLevel,
              location: user.location,
              specialization: user.specialization,
              status: user.status,
              tags: currentTags,
            }}
            isEditing
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Atualizando..." : "Atualizar Usuário"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}