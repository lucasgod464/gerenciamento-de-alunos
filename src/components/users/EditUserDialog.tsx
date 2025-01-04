import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { User, UserStatus } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { UserBasicInfo } from "./dialog/UserBasicInfo";
import { UserAccessLevel } from "./dialog/UserAccessLevel";
import { TagSelectionFields } from "./fields/TagSelectionFields";

interface EditUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: (user: User) => void;
}

export function EditUserDialog({ user, open, onOpenChange, onUserUpdated }: EditUserDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [selectedTags, setSelectedTags] = useState<{ id: string; name: string; color: string; }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      if (user?.id) {
        try {
          console.log('Loading user data for ID:', user.id);
          
          // Load user tags
          const { data: tagData, error: tagError } = await supabase
            .from('user_tags')
            .select(`
              tag_id,
              tags:tag_id (
                id,
                name,
                color
              )
            `)
            .eq('user_id', user.id);

          if (tagError) {
            console.error('Error loading user tags:', tagError);
            throw tagError;
          }

          const userTags = tagData?.map(t => ({
            id: t.tags.id,
            name: t.tags.name,
            color: t.tags.color
          })) || [];
          
          setFormData(user);
          setNewPassword("");
          setSelectedTags(userTags);
        } catch (error) {
          console.error('Error loading user data:', error);
          toast({
            title: "Erro ao carregar dados",
            description: "Não foi possível carregar os dados do usuário.",
            variant: "destructive",
          });
        }
      }
    };

    if (user && open) {
      loadUserData();
    }
  }, [user, open, toast]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData) return;

    try {
      setIsSubmitting(true);

      const updateData: any = {
        name: formData.name,
        email: formData.email,
        access_level: formData.accessLevel,
        location: formData.location || null,
        specialization: formData.specialization || null,
        status: formData.status as UserStatus,
      };

      if (newPassword) {
        updateData.password = newPassword;
      }

      // Update user data
      const { data: updatedUser, error: updateError } = await supabase
        .from('emails')
        .update(updateData)
        .eq('id', formData.id)
        .select('*')
        .single();

      if (updateError) throw updateError;

      // Update tags
      const { error: deleteTagError } = await supabase
        .from('user_tags')
        .delete()
        .eq('user_id', formData.id);

      if (deleteTagError) throw deleteTagError;

      if (selectedTags.length > 0) {
        const tagsData = selectedTags.map(tag => ({
          user_id: formData.id,
          tag_id: tag.id,
        }));

        const { error: tagError } = await supabase
          .from('user_tags')
          .insert(tagsData);

        if (tagError) throw tagError;
      }

      const finalUser: User = {
        ...formData,
        ...updatedUser,
        tags: selectedTags,
        status: formData.status as UserStatus,
      };

      onUserUpdated(finalUser);
      onOpenChange(false);
      toast({
        title: "Usuário atualizado",
        description: "As informações do usuário foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar o usuário.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <UserBasicInfo
            formData={formData}
            setFormData={setFormData}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
          />
          
          <UserAccessLevel
            accessLevel={formData.accessLevel}
            onAccessLevelChange={(value) => setFormData({ ...formData, accessLevel: value })}
          />

          <TagSelectionFields
            selectedTags={selectedTags}
            onTagToggle={(tag) => {
              setSelectedTags(prev => 
                prev.some(t => t.id === tag.id)
                  ? prev.filter(t => t.id !== tag.id)
                  : [...prev, tag]
              );
            }}
          />

          <div className="sticky bottom-0 bg-white pt-4 pb-2">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}