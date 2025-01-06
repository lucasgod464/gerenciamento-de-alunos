import { supabase } from "@/integrations/supabase/client";
import { User, mapDatabaseUser } from "@/types/user";
import { toast } from "sonner";

interface CreateUserData {
  email: string;
  name: string;
  password: string;
  accessLevel: "Admin" | "Usuário Comum";
  companyId: string;
  location?: string;
  specialization?: string;
  status: string;
  role: string;
  selectedRooms?: string[];
  selectedTags?: { id: string; name: string; color: string; }[];
}

export const userService = {
  async updateUser(userData: User) {
    try {
      console.log('Iniciando atualização do usuário:', userData);

      // 1. Atualizar informações básicas do usuário
      const { data: updatedUser, error: updateError } = await supabase
        .from('emails')
        .update({
          name: userData.name,
          email: userData.email,
          access_level: userData.accessLevel,
          location: userData.location || '',
          specialization: userData.specialization || '',
          status: userData.status,
          address: userData.address || '',
        })
        .eq('id', userData.id)
        .select()
        .single();

      if (updateError) {
        console.error('Erro ao atualizar informações básicas:', updateError);
        throw updateError;
      }

      // 2. Atualizar tags
      if (userData.tags) {
        const { error: deleteTagsError } = await supabase
          .from('user_tags')
          .delete()
          .eq('user_id', userData.id);

        if (deleteTagsError) {
          console.error('Erro ao deletar tags antigas:', deleteTagsError);
          throw deleteTagsError;
        }

        if (userData.tags.length > 0) {
          const { error: insertTagsError } = await supabase
            .from('user_tags')
            .insert(
              userData.tags.map(tag => ({
                user_id: userData.id,
                tag_id: tag.id
              }))
            );

          if (insertTagsError) {
            console.error('Erro ao inserir novas tags:', insertTagsError);
            throw insertTagsError;
          }
        }
      }

      // 3. Atualizar salas autorizadas
      if (userData.authorizedRooms) {
        const { error: deleteRoomsError } = await supabase
          .from('user_rooms')
          .delete()
          .eq('user_id', userData.id);

        if (deleteRoomsError) {
          console.error('Erro ao deletar salas antigas:', deleteRoomsError);
          throw deleteRoomsError;
        }

        if (userData.authorizedRooms.length > 0) {
          const { error: insertRoomsError } = await supabase
            .from('user_rooms')
            .insert(
              userData.authorizedRooms.map(room => ({
                user_id: userData.id,
                room_id: room.id
              }))
            );

          if (insertRoomsError) {
            console.error('Erro ao inserir novas salas:', insertRoomsError);
            throw insertRoomsError;
          }
        }
      }

      console.log('Usuário atualizado com sucesso:', updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  },
};
