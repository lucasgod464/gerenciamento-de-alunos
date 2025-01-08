import { useState, useEffect } from "react";
import { User } from "@/types/user";
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

      const mappedUsers: User[] = emailsData.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.access_level === 'Admin' ? 'ADMIN' : 'USER',
        companyId: user.company_id,
        createdAt: user.created_at,
        lastAccess: user.updated_at,
        status: user.status === 'active' ? 'active' : 'inactive',
        accessLevel: user.access_level,
        location: user.location || '',
        specialization: user.specialization || '',
        address: user.address || '',
        tags: user.user_tags?.map(ut => ut.tags) || [],
        authorizedRooms: user.user_rooms?.map(ur => ur.rooms) || [],
        specializations: user.user_specializations?.map(us => us.specializations) || []
      }));

      setUsers(mappedUsers);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Erro ao carregar lista de usuários');
    }
  };

  const handleUpdateUser = async (userData: Partial<User>) => {
    if (!userData || !userData.id) {
      console.error('Dados do usuário ou ID não fornecidos');
      toast.error('Dados do usuário inválidos');
      return;
    }

    try {
      console.log('Atualizando usuário:', userData);

      // Atualizar informações básicas do usuário
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

      // Atualizar salas autorizadas
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

      // Atualizar especializações
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