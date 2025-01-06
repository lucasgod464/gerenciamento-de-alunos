import { useState, useEffect } from "react";
import { User } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      console.log('Carregando usuários do banco de dados...');
      
      const { data: usersData, error: usersError } = await supabase
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
        `);

      if (usersError) throw usersError;

      const mappedUsers = usersData.map(dbUser => ({
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.access_level as any,
        companyId: dbUser.company_id,
        createdAt: dbUser.created_at,
        lastAccess: dbUser.updated_at,
        status: dbUser.status as "active" | "inactive",
        accessLevel: dbUser.access_level,
        location: dbUser.location || '',
        specialization: dbUser.specialization || '',
        address: dbUser.address || '',
        tags: dbUser.user_tags?.map(ut => ({
          id: ut.tags.id,
          name: ut.tags.name,
          color: ut.tags.color
        })) || [],
        authorizedRooms: dbUser.user_rooms?.map(ur => ({
          id: ur.rooms.id,
          name: ur.rooms.name
        })) || []
      }));

      console.log('Usuários carregados:', mappedUsers);
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Erro ao carregar lista de usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      const { error } = await supabase
        .from('emails')
        .update({
          name: updatedUser.name,
          email: updatedUser.email,
          access_level: updatedUser.accessLevel,
          location: updatedUser.location,
          specialization: updatedUser.specialization,
          status: updatedUser.status,
          address: updatedUser.address,
        })
        .eq('id', updatedUser.id);

      if (error) throw error;

      await loadUsers(); // Recarrega a lista após atualização bem-sucedida
      toast.success('Usuário atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast.error('Erro ao atualizar usuário');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
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

  // Configurar listener para atualizações em tempo real
  useEffect(() => {
    const channel = supabase
      .channel('emails-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'emails'
        },
        () => {
          console.log('Mudança detectada na tabela emails, recarregando dados...');
          loadUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Carregar dados iniciais
  useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    loading,
    loadUsers,
    handleUpdateUser,
    handleDeleteUser
  };
}