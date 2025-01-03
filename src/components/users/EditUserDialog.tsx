import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { User, AccessLevel } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { RoomSelectionFields } from "./fields/RoomSelectionFields";
import { TagSelectionFields } from "./fields/TagSelectionFields";
import { UserBasicInfo } from "./dialog/UserBasicInfo";
import { UserAccessLevel } from "./dialog/UserAccessLevel";

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
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<{ id: string; name: string; color: string; }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(user);
      setNewPassword("");
      setSelectedRooms(user.authorizedRooms || []);
      setSelectedTags(user.tags || []);
    }
  }, [user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData) return;

    try {
      setIsSubmitting(true);

      // Update user basic info
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        access_level: formData.access_level,
        location: formData.location || null,
        specialization: formData.specialization || null,
        status: formData.status,
      };

      if (newPassword) {
        updateData.password = newPassword;
      }

      const { data: updatedUser, error: updateError } = await supabase
        .from('emails')
        .update(updateData)
        .eq('id', formData.id)
        .select('*')
        .single();

      if (updateError) throw updateError;

      // Update authorized rooms
      await supabase
        .from('user_authorized_rooms')
        .delete()
        .eq('user_id', formData.id);

      if (selectedRooms.length > 0) {
        const roomsData = selectedRooms.map(roomId => ({
          user_id: formData.id,
          room_id: roomId,
        }));

        const { error: roomsError } = await supabase
          .from('user_authorized_rooms')
          .insert(roomsData);

        if (roomsError) throw roomsError;
      }

      // Update user tags
      await supabase
        .from('user_tags')
        .delete()
        .eq('user_id', formData.id);

      if (selectedTags.length > 0) {
        const tagsData = selectedTags.map(tag => ({
          user_id: formData.id,
          tag_id: tag.id,
        }));

        const { error: tagsError } = await supabase
          .from('user_tags')
          .insert(tagsData);

        if (tagsError) throw tagsError;
      }

      const finalUser: User = {
        ...formData,
        ...updatedUser,
        authorizedRooms: selectedRooms,
        tags: selectedTags,
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
            accessLevel={formData.access_level}
            onAccessLevelChange={(value) => setFormData({ ...formData, access_level: value })}
          />

          <RoomSelectionFields
            selectedRooms={selectedRooms}
            onRoomToggle={(roomId) => {
              setSelectedRooms(prev => 
                prev.includes(roomId) 
                  ? prev.filter(id => id !== roomId)
                  : [...prev, roomId]
              );
            }}
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