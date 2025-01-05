import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types/user";
import { useState, useEffect } from "react";
import UserFormFields from "./UserFormFields";
import { useUserUpdate } from "./hooks/useUserUpdate";
import { supabase } from "@/integrations/supabase/client";

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
  const [selectedTags, setSelectedTags] = useState<{ id: string; name: string; color: string; }[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const { updateUser, loading } = useUserUpdate();

  useEffect(() => {
    if (user && open) {
      setSelectedTags(user.tags || []);
      setSelectedRooms(user.authorizedRooms?.map(room => room.id) || []);
      
      const loadUserSpecializations = async () => {
        const { data, error } = await supabase
          .from('user_specializations')
          .select('specialization_id')
          .eq('user_id', user.id);

        if (!error && data) {
          setSelectedSpecializations(data.map(item => item.specialization_id));
        }
      };
      loadUserSpecializations();
    }
  }, [user, open]);

  const handleUpdateUser = async (formData: FormData) => {
    try {
      if (!user) return;

      const updatedUser = await updateUser(
        user,
        formData,
        selectedTags,
        selectedRooms,
        selectedSpecializations
      );

      if (updatedUser) {
        toast({
          title: "Usuário atualizado",
          description: "O usuário foi atualizado com sucesso.",
        });
        onUserUpdated(updatedUser);
        onOpenChange(false);
      }
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Faça as alterações necessárias nos dados do usuário
          </DialogDescription>
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
              authorizedRooms: user.authorizedRooms,
              address: user.address || ''
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