import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/user";
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
  selectedSpecializations?: string[];
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
        await supabase
          .from('user_tags')
          .delete()
          .eq('user_id', userData.id);

        if (userData.tags.length > 0) {
          const { error: insertTagsError } = await supabase
            .from('user_tags')
            .insert(
              userData.tags.map(tag => ({
                user_id: userData.id,
                tag_id: tag.id
              }))
            );

          if (insertTagsError) throw insertTagsError;
        }
      }

      // 3. Atualizar salas autorizadas
      if (userData.authorizedRooms) {
        await supabase
          .from('user_rooms')
          .delete()
          .eq('user_id', userData.id);

        if (userData.authorizedRooms.length > 0) {
          const { error: insertRoomsError } = await supabase
            .from('user_rooms')
            .insert(
              userData.authorizedRooms.map(room => ({
                user_id: userData.id,
                room_id: room.id
              }))
            );

          if (insertRoomsError) throw insertRoomsError;
        }
      }

      // 4. Atualizar especializações
      if (userData.specializations) {
        await supabase
          .from('user_specializations')
          .delete()
          .eq('user_id', userData.id);

        if (userData.specializations.length > 0) {
          const { error: insertSpecsError } = await supabase
            .from('user_specializations')
            .insert(
              userData.specializations.map(spec => ({
                user_id: userData.id,
                specialization_id: spec.id
              }))
            );

          if (insertSpecsError) throw insertSpecsError;
        }
      }

      return updatedUser;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  },

  async createUser(userData: CreateUserData) {
    try {
      // 1. Criar usuário
      const { data: newUser, error: createError } = await supabase
        .from('emails')
        .insert([{
          name: userData.name,
          email: userData.email,
          password: userData.password,
          access_level: userData.accessLevel,
          company_id: userData.companyId,
          location: userData.location,
          specialization: userData.specialization,
          status: userData.status
        }])
        .select()
        .single();

      if (createError) throw createError;

      // 2. Adicionar salas autorizadas
      if (userData.selectedRooms?.length) {
        const { error: roomsError } = await supabase
          .from('user_rooms')
          .insert(
            userData.selectedRooms.map(roomId => ({
              user_id: newUser.id,
              room_id: roomId
            }))
          );

        if (roomsError) throw roomsError;
      }

      // 3. Adicionar tags
      if (userData.selectedTags?.length) {
        const { error: tagsError } = await supabase
          .from('user_tags')
          .insert(
            userData.selectedTags.map(tag => ({
              user_id: newUser.id,
              tag_id: tag.id
            }))
          );

        if (tagsError) throw tagsError;
      }

      // 4. Adicionar especializações
      if (userData.selectedSpecializations?.length) {
        const { error: specsError } = await supabase
          .from('user_specializations')
          .insert(
            userData.selectedSpecializations.map(specId => ({
              user_id: newUser.id,
              specialization_id: specId
            }))
          );

        if (specsError) throw specsError;
      }

      return newUser;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }
};