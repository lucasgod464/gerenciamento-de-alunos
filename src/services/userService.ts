import { supabase } from "@/integrations/supabase/client";
import { User, CreateUserData, UserResponse, mapSupabaseUser } from "@/types/user";

export const userService = {
  async updateUser(userData: User) {
    try {
      console.log('Iniciando atualização do usuário:', userData);

      // 1. Atualizar informações básicas do usuário
      const { error: updateError } = await supabase
        .from('emails')
        .update({
          name: userData.name,
          email: userData.email,
          access_level: userData.accessLevel,
          location: userData.location || '',
          specialization: userData.specialization || '',
          status: userData.status,
          address: userData.address || '',
          updated_at: new Date().toISOString()
        })
        .eq('id', userData.id);

      if (updateError) throw updateError;

      // 2. Atualizar tags
      await supabase
        .from('user_tags')
        .delete()
        .eq('user_id', userData.id);

      if (userData.tags && userData.tags.length > 0) {
        const { error: tagsError } = await supabase
          .from('user_tags')
          .insert(
            userData.tags.map(tag => ({
              user_id: userData.id,
              tag_id: tag.id
            }))
          );

        if (tagsError) throw tagsError;
      }

      // 3. Atualizar salas autorizadas
      await supabase
        .from('user_rooms')
        .delete()
        .eq('user_id', userData.id);

      if (userData.authorizedRooms && userData.authorizedRooms.length > 0) {
        const { error: roomsError } = await supabase
          .from('user_rooms')
          .insert(
            userData.authorizedRooms.map(room => ({
              user_id: userData.id,
              room_id: room.id
            }))
          );

        if (roomsError) throw roomsError;
      }

      // 4. Atualizar especializações
      await supabase
        .from('user_specializations')
        .delete()
        .eq('user_id', userData.id);

      if (userData.specializations && userData.specializations.length > 0) {
        const { error: specsError } = await supabase
          .from('user_specializations')
          .insert(
            userData.specializations.map(spec => ({
              user_id: userData.id,
              specialization_id: spec.id
            }))
          );

        if (specsError) throw specsError;
      }

      // 5. Buscar usuário atualizado com todas as relações
      const { data: updatedUser, error: fetchError } = await supabase
        .from('emails')
        .select(`
          *,
          user_tags (
            tags (
              id,
              name,
              color
            )
          ),
          user_rooms (
            rooms (
              id,
              name
            )
          ),
          user_specializations (
            specializations (
              id,
              name
            )
          )
        `)
        .eq('id', userData.id)
        .single();

      if (fetchError) throw fetchError;

      return mapSupabaseUser(updatedUser as UserResponse);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  },

  async createUser(userData: CreateUserData) {
    try {
      console.log('Iniciando criação do usuário:', userData);
      
      // 1. Criar usuário
      const { data: newUser, error: createError } = await supabase
        .from('emails')
        .insert([{
          name: userData.name,
          email: userData.email,
          password: userData.password,
          access_level: userData.accessLevel,
          company_id: userData.companyId,
          location: userData.location || '',
          specialization: userData.specialization || '',
          status: userData.status || 'active',
          address: userData.address || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
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

      // 5. Buscar usuário criado com todas as relações
      const { data: createdUser, error: fetchError } = await supabase
        .from('emails')
        .select(`
          *,
          user_tags (
            tags (
              id,
              name,
              color
            )
          ),
          user_rooms (
            rooms (
              id,
              name
            )
          ),
          user_specializations (
            specializations (
              id,
              name
            )
          )
        `)
        .eq('id', newUser.id)
        .single();

      if (fetchError) throw fetchError;

      return mapSupabaseUser(createdUser as UserResponse);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }
};