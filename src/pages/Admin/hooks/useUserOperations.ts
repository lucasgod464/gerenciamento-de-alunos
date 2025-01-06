import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/user";
import { toast } from "sonner";

export async function updateUserData(updatedUser: User) {
  console.log('Iniciando atualização do usuário:', updatedUser);

  try {
    // Atualiza informações básicas do usuário
    const { data: userData, error: updateError } = await supabase
      .from('emails')
      .update({
        name: updatedUser.name,
        email: updatedUser.email,
        access_level: updatedUser.accessLevel,
        location: updatedUser.location || '',
        specialization: updatedUser.specialization || '',
        status: updatedUser.status,
        address: updatedUser.address || ''
      })
      .eq('id', updatedUser.id)
      .select()
      .single();

    if (updateError) {
      console.error('Erro ao atualizar usuário:', updateError);
      throw updateError;
    }

    console.log('Dados básicos atualizados:', userData);

    // Atualiza tags
    await supabase
      .from('user_tags')
      .delete()
      .eq('user_id', updatedUser.id);

    if (updatedUser.tags && updatedUser.tags.length > 0) {
      const { error: tagsError } = await supabase
        .from('user_tags')
        .insert(updatedUser.tags.map(tag => ({
          user_id: updatedUser.id,
          tag_id: tag.id
        })));

      if (tagsError) throw tagsError;
    }

    // Atualiza salas autorizadas
    await supabase
      .from('user_rooms')
      .delete()
      .eq('user_id', updatedUser.id);

    if (updatedUser.authorizedRooms && updatedUser.authorizedRooms.length > 0) {
      const { error: roomsError } = await supabase
        .from('user_rooms')
        .insert(updatedUser.authorizedRooms.map(room => ({
          user_id: updatedUser.id,
          room_id: room.id
        })));

      if (roomsError) throw roomsError;
    }

    return userData;
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw error;
  }
}

export async function deleteUser(userId: string) {
  try {
    const { error } = await supabase
      .from('emails')
      .delete()
      .eq('id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    throw error;
  }
}