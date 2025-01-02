import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserFormFields } from "./dialog/UserFormFields";
import { RoomSelection } from "./dialog/RoomSelection";
import { Room } from "@/types/room";
import { useAuth } from "@/hooks/useAuth";

interface EditUserDialogProps {
  user: User | null;
  onClose: () => void;
  onSubmit: (updatedUser: User) => void;
}

export function EditUserDialog({ user, onClose, onSubmit }: EditUserDialogProps) {
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (user) {
      setEditedUser(user);
      fetchUserRooms();
      fetchAvailableRooms();
    }
  }, [user]);

  const fetchUserRooms = async () => {
    if (!user) return;
    
    try {
      const { data: roomData } = await supabase
        .from('user_authorized_rooms')
        .select('room_id')
        .eq('user_id', user.id);
      
      if (roomData) {
        setSelectedRooms(roomData.map(r => r.room_id));
      }
    } catch (error) {
      console.error('Error fetching user rooms:', error);
    }
  };

  const fetchAvailableRooms = async () => {
    if (!currentUser?.companyId) return;

    try {
      const { data: rooms } = await supabase
        .from('rooms')
        .select('*')
        .eq('company_id', currentUser.companyId)
        .eq('status', true);

      if (rooms) {
        setAvailableRooms(rooms);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    if (!editedUser) return;
    setEditedUser({ ...editedUser, [field]: value });
  };

  const handleRoomToggle = (roomId: string) => {
    setSelectedRooms(prev => 
      prev.includes(roomId)
        ? prev.filter(id => id !== roomId)
        : [...prev, roomId]
    );
  };

  const handleSubmit = async () => {
    if (!editedUser) return;

    try {
      // Update user in emails table
      const { error: updateError } = await supabase
        .from('emails')
        .update({
          name: editedUser.name,
          email: editedUser.email,
          location: editedUser.location,
          access_level: editedUser.status === 'active' ? 'Usuário Comum' : 'Inativo',
        })
        .eq('id', editedUser.id);

      if (updateError) throw updateError;

      // Update user's authorized rooms
      // First, remove existing room authorizations
      await supabase
        .from('user_authorized_rooms')
        .delete()
        .eq('user_id', editedUser.id);

      // Then, add new room authorizations
      if (selectedRooms.length > 0) {
        const { error: roomsError } = await supabase
          .from('user_authorized_rooms')
          .insert(
            selectedRooms.map(roomId => ({
              user_id: editedUser.id,
              room_id: roomId
            }))
          );

        if (roomsError) throw roomsError;
      }

      onSubmit(editedUser);
      toast({
        title: "Usuário atualizado",
        description: "As informações do usuário foram atualizadas com sucesso.",
      });
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar o usuário.",
        variant: "destructive",
      });
    }
  };

  if (!editedUser) return null;

  return (
    <Dialog open={!!user} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <UserFormFields 
            user={editedUser}
            onChange={handleFieldChange}
          />
          <RoomSelection
            rooms={availableRooms}
            selectedRooms={selectedRooms}
            onRoomToggle={handleRoomToggle}
          />
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>Salvar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}