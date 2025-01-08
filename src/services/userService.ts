import { supabase } from "@/integrations/supabase/client";
import { User, CreateUserData } from "@/types/user";
import { toast } from "@/hooks/use-toast";

export const userService = {
  async createUser(userData: CreateUserData): Promise<User | null> {
    try {
      // Verificar se o email já existe
      const { data: existingUser } = await supabase
        .from('emails')
        .select('email')
        .eq('email', userData.email)
        .single();

      if (existingUser) {
        toast({
          title: "Erro",
          description: "Este email já está em uso",
          variant: "destructive",
        });
        return null;
      }

      // Criar o usuário
      const { data: newUser, error } = await supabase
        .from('emails')
        .insert([{
          name: userData.name,
          email: userData.email,
          password: userData.password,
          access_level: userData.accessLevel,
          company_id: userData.companyId,
          location: userData.location || '',
          specialization: userData.specialization || '',
          address: userData.address || '',
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;

      // Vincular salas autorizadas
      if (userData.selectedRooms?.length) {
        const roomInserts = userData.selectedRooms.map(roomId => ({
          user_id: newUser.id,
          room_id: roomId
        }));

        await supabase.from('user_rooms').insert(roomInserts);
      }

      // Vincular tags
      if (userData.selectedTags?.length) {
        const tagInserts = userData.selectedTags.map(tagId => ({
          user_id: newUser.id,
          tag_id: tagId
        }));

        await supabase.from('user_tags').insert(tagInserts);
      }

      // Vincular especializações
      if (userData.selectedSpecializations?.length) {
        const specInserts = userData.selectedSpecializations.map(specId => ({
          user_id: newUser.id,
          specialization_id: specId
        }));

        await supabase.from('user_specializations').insert(specInserts);
      }

      toast({
        title: "Sucesso",
        description: "Usuário criado com sucesso",
      });

      return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: userData.role,
        companyId: userData.companyId,
        createdAt: newUser.created_at,
        lastAccess: newUser.last_access,
        status: 'active',
        accessLevel: userData.accessLevel,
        location: userData.location || '',
        specialization: userData.specialization || '',
        address: userData.address || '',
        tags: [],
        authorizedRooms: [],
        specializations: []
      };

    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o usuário",
        variant: "destructive",
      });
      return null;
    }
  },

  async updateUser(userData: User) {
    try {
      console.log('Iniciando atualização do usuário:', userData);

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

      if (updateError) throw updateError;

      if (userData.tags) {
        await supabase
          .from('user_tags')
          .delete()
          .eq('user_id', userData.id);

        if (userData.tags.length > 0) {
          await supabase
            .from('user_tags')
            .insert(
              userData.tags.map(tag => ({
                user_id: userData.id,
                tag_id: tag.id
              }))
            );
        }
      }

      if (userData.authorizedRooms) {
        await supabase
          .from('user_rooms')
          .delete()
          .eq('user_id', userData.id);

        if (userData.authorizedRooms.length > 0) {
          await supabase
            .from('user_rooms')
            .insert(
              userData.authorizedRooms.map(room => ({
                user_id: userData.id,
                room_id: room.id
              }))
            );
        }
      }

      if (userData.specializations) {
        await supabase
          .from('user_specializations')
          .delete()
          .eq('user_id', userData.id);

        if (userData.specializations.length > 0) {
          await supabase
            .from('user_specializations')
            .insert(
              userData.specializations.map(spec => ({
                user_id: userData.id,
                specialization_id: spec.id
              }))
            );
        }
      }

      return updatedUser;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  },
};
