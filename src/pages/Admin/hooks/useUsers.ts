import { useState, useEffect } from "react";
import { User } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { updateUserData, deleteUser } from "./useUserOperations";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);

  const loadUsers = async () => {
    try {
      console.log('Buscando usuários do banco de dados...');
      
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

      console.log('Dados dos usuários recebidos:', usersData);
      
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
        location: dbUser.location,
        specialization: dbUser.specialization,
        address: dbUser.address,
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

      setUsers(mappedUsers);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast.error("Erro ao carregar a lista de usuários");
    }
  };

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      console.log('Atualizando usuário:', updatedUser);
      
      await updateUserData(updatedUser);
      
      toast.success("Usuário atualizado com sucesso!");
      
      // Recarrega a lista de usuários para garantir dados atualizados
      await loadUsers();
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast.error("Erro ao atualizar usuário");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      setUsers(prev => prev.filter(user => user.id !== userId));
      toast.success("Usuário excluído com sucesso!");
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast.error("Erro ao excluir usuário");
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
    handleDeleteUser
  };
}