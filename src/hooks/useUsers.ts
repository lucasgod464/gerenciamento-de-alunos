import { useState, useEffect } from "react";
import { User, UserResponse, mapSupabaseUser } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const { user: currentUser } = useAuth();

  const loadUsers = async () => {
    if (!currentUser?.companyId) {
      console.error('No company ID found');
      return;
    }

    try {
      console.log('Carregando usuários...');
      const { data: emailsData, error: emailsError } = await supabase
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
        .eq('company_id', currentUser.companyId);

      if (emailsError) throw emailsError;

      const mappedUsers = emailsData.map(user => mapSupabaseUser(user as UserResponse));
      console.log('Usuários carregados:', mappedUsers);
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Erro ao carregar lista de usuários');
    }
  };

  const handleUpdateUser = async (userData: User) => {
    try {
      console.log('Atualizando usuário:', userData);
      
      // Atualizar informações básicas
      const { error: updateError } = await supabase
        .from('emails')
        .update({
          name: userData.name,
          email: userData.email,
          access_level: userData.accessLevel,
          location: userData.location || '',
          specialization: userData.specialization || '',
          status: userData.status,
          address: userData.address || ''
        })
        .eq('id', userData.id);

      if (updateError) throw updateError;

      // Atualizar tags
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

      // Atualizar salas autorizadas
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

      // Atualizar especializações
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

      await loadUsers(); // Recarregar lista após atualização
      toast.success('Usuário atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast.error('Erro ao atualizar usuário');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // Primeiro remove as relações
      await Promise.all([
        supabase.from('user_tags').delete().eq('user_id', userId),
        supabase.from('user_rooms').delete().eq('user_id', userId),
        supabase.from('user_specializations').delete().eq('user_id', userId)
      ]);

      // Depois remove o usuário
      const { error } = await supabase
        .from('emails')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev => prev.filter(user => user.id !== userId));
      toast.success('Usuário excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast.error('Erro ao excluir usuário');
    }
  };

  useEffect(() => {
    if (currentUser?.companyId) {
      loadUsers();
    }
  }, [currentUser?.companyId]);

  return {
    users,
    loadUsers,
    handleUpdateUser,
    handleDeleteUser
  };
}