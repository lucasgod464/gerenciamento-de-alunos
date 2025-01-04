import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import UserFormFields from "./UserFormFields";
import { generateStrongPassword } from "@/utils/passwordUtils";
import { User } from "@/types/user";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated: (user: User) => void;
}

export function CreateUserDialog({
  open,
  onOpenChange,
  onUserCreated
}: CreateUserDialogProps) {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<{ id: string; name: string; color: string; }[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);

  const handleCreateUser = async (formData: FormData) => {
    if (!currentUser?.companyId) return;

    try {
      setLoading(true);

      const password = generateStrongPassword();
      const userData = {
        name: formData.get('name')?.toString() || '',
        email: formData.get('email')?.toString() || '',
        password,
        access_level: formData.get('accessLevel')?.toString() as "Admin" | "Usuário Comum",
        company_id: currentUser.companyId,
        location: formData.get('location')?.toString() || '',
        specialization: formData.get('specialization')?.toString() || '',
        status: formData.get('status')?.toString() || 'active',
        address: formData.get('address')?.toString() || ''
      };

      const { data: newUser, error: createError } = await supabase
        .from('emails')
        .insert([userData])
        .select()
        .single();

      if (createError) throw createError;

      // Add tags
      if (selectedTags.length > 0) {
        const { error: tagsError } = await supabase
          .from('user_tags')
          .insert(selectedTags.map(tag => ({
            user_id: newUser.id,
            tag_id: tag.id
          })));

        if (tagsError) throw tagsError;
      }

      // Add rooms
      if (selectedRooms.length > 0) {
        const { error: roomsError } = await supabase
          .from('user_rooms')
          .insert(selectedRooms.map(roomId => ({
            user_id: newUser.id,
            room_id: roomId
          })));

        if (roomsError) throw roomsError;
      }

      // Fetch room names for the response
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('id, name')
        .in('id', selectedRooms);

      if (roomsError) throw roomsError;

      const createdUser: User = {
        id: newUser.id,
        name: userData.name,
        email: userData.email,
        role: userData.access_level,
        companyId: userData.company_id,
        createdAt: newUser.created_at,
        lastAccess: null,
        status: userData.status,
        accessLevel: userData.access_level,
        location: userData.location,
        specialization: userData.specialization,
        address: userData.address,
        tags: selectedTags,
        authorizedRooms: roomsData?.map(room => ({
          id: room.id,
          name: room.name
        })) || []
      };

      toast({
        title: "Usuário criado",
        description: "O usuário foi criado com sucesso. A senha é: " + password,
      });

      onUserCreated(createdUser);
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Erro ao criar usuário",
        description: "Ocorreu um erro ao criar o usuário.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Criar Novo Usuário</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleCreateUser(new FormData(e.currentTarget));
        }} className="space-y-4">
          <UserFormFields
            onTagsChange={setSelectedTags}
            onRoomsChange={setSelectedRooms}
            generateStrongPassword={generateStrongPassword}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar Usuário"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}