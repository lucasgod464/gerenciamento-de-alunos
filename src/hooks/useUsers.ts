import { useState, useEffect } from "react";
import { User } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { userService } from "@/services/userService";
import { useAuth } from "@/hooks/useAuth";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const loadUsers = async () => {
    setLoading(true);
    try {
      if (!user?.companyId) {
        console.error('No company ID found for user');
        setUsers([]);
        return;
      }

      console.log('Carregando usuários do banco de dados para empresa:', user.companyId);
      
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
        `)
        .eq('company_id', user.companyId);

      if (usersError) {
        console.error('Erro ao carregar usuários:', usersError);
        toast.error('Erro ao carregar lista de usuários');
        return;
      }

      const mappedUsers = usersData.map(dbUser => ({
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.access_level === 'Admin' ? 'ADMIN' : 'USER',
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
        })) || [],
        specializations: dbUser.user_specializations?.map(us => ({
          id: us.specializations.id,
          name: us.specializations.name
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
      setLoading(true);
      console.log('Iniciando atualização do usuário:', updatedUser);
      
      await userService.updateUser(updatedUser);
      
      toast.success('Usuário atualizado com sucesso');
      await loadUsers(); // Recarrega a lista após atualização
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast.error('Erro ao atualizar usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      setLoading(true);
      
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.companyId) {
      loadUsers();
    }
  }, [user?.companyId]);

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
        (payload) => {
          console.log('Mudança detectada na tabela emails:', payload);
          loadUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    users,
    loading,
    loadUsers,
    handleUpdateUser,
    handleDeleteUser
  };
}