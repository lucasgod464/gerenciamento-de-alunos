import { useState } from 'react';
import { User } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useUserOperations() {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateUser = async (updatedUser: User) => {
    setIsUpdating(true);
    try {
      console.log('Atualizando usuário:', updatedUser);

      // Atualizar informações básicas do usuário
      const { error: updateError } = await supabase
        .from('emails')
        .update({
          name: updatedUser.name,
          email: updatedUser.email,
          access_level: updatedUser.accessLevel,
          location: updatedUser.location || '',
          specialization: updatedUser.specialization || '',
          status: updatedUser.status,
          address: updatedUser.address || '',
        })
        .eq('id', updatedUser.id);

      if (updateError) throw updateError;

      // Atualizar tags
      if (updatedUser.tags) {
        await supabase
          .from('user_tags')
          .delete()
          .eq('user_id', updatedUser.id);

        if (updatedUser.tags.length > 0) {
          const { error: tagsError } = await supabase
            .from('user_tags')
            .insert(
              updatedUser.tags.map(tag => ({
                user_id: updatedUser.id,
                tag_id: tag.id
              }))
            );

          if (tagsError) throw tagsError;
        }
      }

      // Atualizar salas autorizadas
      if (updatedUser.authorizedRooms) {
        await supabase
          .from('user_rooms')
          .delete()
          .eq('user_id', updatedUser.id);

        if (updatedUser.authorizedRooms.length > 0) {
          const { error: roomsError } = await supabase
            .from('user_rooms')
            .insert(
              updatedUser.authorizedRooms.map(room => ({
                user_id: updatedUser.id,
                room_id: room.id
              }))
            );

          if (roomsError) throw roomsError;
        }
      }

      toast.success('Usuário atualizado com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast.error('Erro ao atualizar usuário');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateUser,
    isUpdating
  };
}