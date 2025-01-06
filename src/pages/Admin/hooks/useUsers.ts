import { useState, useEffect } from "react";
import { User } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useUserOperations } from "@/hooks/useUserOperations";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const { updateUser, isUpdating } = useUserOperations();

  const loadUsers = async () => {
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
      setUsers(mappedUsers as User[]);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Erro ao carregar lista de usuários');
    }
  };

  const handleUpdateUser = async (updatedUser: User) => {
    const success = await updateUser(updatedUser);
    if (success) {
      await loadUsers(); // Recarrega a lista após atualização bem-sucedida
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
    loadUsers,
    handleUpdateUser,
    handleDeleteUser,
    isUpdating
  };
}