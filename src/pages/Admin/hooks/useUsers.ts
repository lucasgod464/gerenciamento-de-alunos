import { useState, useEffect } from "react";
import { User, UserResponse, mapSupabaseUser } from "@/types/user";
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

      const mappedUsers = usersData.map(dbUser => mapSupabaseUser(dbUser as UserResponse));
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
      
      const updatedUserData = await userService.updateUser(updatedUser);
      
      // Atualizar estado local imediatamente
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === updatedUserData.id ? updatedUserData : user
        )
      );
      
      toast.success('Usuário atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast.error('Erro ao atualizar usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData: CreateUserData) => {
    try {
      setLoading(true);
      const newUser = await userService.createUser(userData);
      
      // Adicionar novo usuário ao estado local
      setUsers(prevUsers => [...prevUsers, newUser]);
      
      toast.success('Usuário criado com sucesso');
      return newUser;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      toast.error('Erro ao criar usuário');
      throw error;
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

      // Atualizar estado local imediatamente
      setUsers(prev => prev.filter(user => user.id !== userId));
      toast.success('Usuário excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast.error('Erro ao excluir usuário');
    } finally {
      setLoading(false);
    }
  };

  // Configurar listener para atualizações em tempo real
  useEffect(() => {
    if (!user?.companyId) return;

    const channel = supabase
      .channel('emails-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'emails',
          filter: `company_id=eq.${user.companyId}`
        },
        async (payload) => {
          console.log('Mudança detectada na tabela emails:', payload);
          
          // Buscar dados completos do usuário afetado
          const { data: userData, error } = await supabase
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
            .eq('id', payload.new.id)
            .single();

          if (error) {
            console.error('Erro ao buscar dados atualizados:', error);
            return;
          }

          const mappedUser = mapSupabaseUser(userData as UserResponse);

          // Atualizar estado local baseado no tipo de evento
          switch (payload.eventType) {
            case 'INSERT':
              setUsers(prev => [...prev, mappedUser]);
              break;
            case 'UPDATE':
              setUsers(prev => 
                prev.map(user => 
                  user.id === mappedUser.id ? mappedUser : user
                )
              );
              break;
            case 'DELETE':
              setUsers(prev => prev.filter(user => user.id !== payload.old.id));
              break;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.companyId]);

  useEffect(() => {
    if (user?.companyId) {
      loadUsers();
    }
  }, [user?.companyId]);

  return {
    users,
    loading,
    loadUsers,
    handleUpdateUser,
    handleDeleteUser,
    handleCreateUser
  };
}