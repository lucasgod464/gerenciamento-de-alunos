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
    const loadUserData = async () => {
      if (user?.id) {
        // Load authorized rooms
        const { data: roomData } = await supabase
          .from('user_authorized_rooms')
          .select('room_id')
          .eq('user_id', user.id);

        const authorizedRooms = roomData?.map(r => r.room_id) || [];
        
        setFormData(user);
        setNewPassword("");
        setSelectedRooms(authorizedRooms);
        setSelectedTags(user.tags || []);
      }
    };

    if (user) {
      loadUserData();
    }
  }, [user]);

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

      const { data: updatedUser, error: updateError } = await supabase
        .from('emails')
        .update(updateData)
        .eq('id', formData.id)
        .select('*')
        .single();

      if (updateError) throw updateError;

      // Delete existing room authorizations
      await supabase
        .from('user_authorized_rooms')
        .delete()
        .eq('user_id', formData.id);

      // Insert new room authorizations
      if (selectedRooms.length > 0) {
        const roomsData = selectedRooms.map(roomId => ({
          user_id: formData.id,
          room_id: roomId,
        }));

        const { error: roomError } = await supabase
          .from('user_authorized_rooms')
          .insert(roomsData);

        if (roomError) throw roomError;
      }

      // Update tags
      await supabase
        .from('user_tags')
        .delete()
        .eq('user_id', formData.id);

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
        authorizedRooms: selectedRooms,
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