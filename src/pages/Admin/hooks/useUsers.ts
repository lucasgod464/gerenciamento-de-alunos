import { useState, useEffect } from "react";
import { User } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { userService } from "@/services/userService";
import { useAuth } from "@/hooks/useAuth";

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  accessLevel: "Admin" | "Usuário Comum";
  companyId: string;
  location?: string;
  specialization?: string;
  status: string;
  selectedRooms?: string[];
  selectedTags?: { id: string; name: string; color: string; }[];
  selectedSpecializations?: string[];
}

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
        role: dbUser.access_level,
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

  const handleCreateUser = async (userData: CreateUserData) => {
    try {
      setLoading(true);
      const newUser = await userService.createUser(userData);
      
      if (newUser) {
        // Atualiza o estado local imediatamente
        setUsers(prevUsers => [...prevUsers, {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.access_level,
          companyId: newUser.company_id,
          createdAt: newUser.created_at,
          lastAccess: newUser.updated_at,
          status: newUser.status as "active" | "inactive",
          accessLevel: newUser.access_level,
          location: newUser.location || '',
          specialization: newUser.specialization || '',
          address: newUser.address || '',
          tags: [],
          authorizedRooms: [],
          specializations: []
        }]);
        
        toast.success('Usuário criado com sucesso');
      }
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      toast.error('Erro ao criar usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      setLoading(true);
      console.log('Iniciando atualização do usuário:', updatedUser);
      
      const result = await userService.updateUser(updatedUser);
      
      if (result) {
        // Atualiza o estado local imediatamente
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === updatedUser.id ? updatedUser : user
          )
        );
        
        toast.success('Usuário atualizado com sucesso');
      }
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

      const { error } = await supabase
        .from('emails')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      // Atualiza o estado local imediatamente
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
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
        (payload) => {
          console.log('Mudança detectada na tabela emails:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newUser = payload.new;
            setUsers(prevUsers => [...prevUsers, {
              id: newUser.id,
              name: newUser.name,
              email: newUser.email,
              role: newUser.access_level,
              companyId: newUser.company_id,
              createdAt: newUser.created_at,
              lastAccess: newUser.updated_at,
              status: newUser.status as "active" | "inactive",
              accessLevel: newUser.access_level,
              location: newUser.location || '',
              specialization: newUser.specialization || '',
              address: newUser.address || '',
              tags: [],
              authorizedRooms: [],
              specializations: []
            }]);
          } 
          else if (payload.eventType === 'UPDATE') {
            const updatedUser = payload.new;
            setUsers(prevUsers => 
              prevUsers.map(user => 
                user.id === updatedUser.id 
                  ? {
                      ...user,
                      name: updatedUser.name,
                      email: updatedUser.email,
                      role: updatedUser.access_level,
                      status: updatedUser.status as "active" | "inactive",
                      accessLevel: updatedUser.access_level,
                      location: updatedUser.location || '',
                      specialization: updatedUser.specialization || '',
                      address: updatedUser.address || '',
                      lastAccess: updatedUser.updated_at
                    }
                  : user
              )
            );
          }
          else if (payload.eventType === 'DELETE') {
            const deletedUserId = payload.old.id;
            setUsers(prevUsers => 
              prevUsers.filter(user => user.id !== deletedUserId)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.companyId]);

  // Carrega os usuários inicialmente
  useEffect(() => {
    if (user?.companyId) {
      loadUsers();
    }
  }, [user?.companyId]);

  return {
    users,
    loading,
    loadUsers,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser
  };
}