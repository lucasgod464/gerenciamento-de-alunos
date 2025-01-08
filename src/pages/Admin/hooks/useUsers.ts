import { useState, useEffect } from "react";
import { User, CreateUserData } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { userService } from "@/services/userService";
import { useAuth } from "@/hooks/useAuth";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const { user: currentUser } = useAuth();

  const loadUsers = async () => {
    if (!currentUser?.companyId) return;

    try {
      const { data, error } = await supabase
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

      if (error) throw error;

      const mappedUsers = data?.map(user => ({
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
      })) || [];

      setUsers(mappedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Erro ao carregar lista de usuários');
    }
  };

  const handleUpdateUser = async (userData: Partial<User>) => {
    if (!userData.id) return;

    try {
      const updatedUser = await userService.updateUser({
        ...userData,
        id: userData.id,
        companyId: currentUser?.companyId || '',
        role: userData.role || 'USER',
        status: userData.status || 'active'
      } as User);

      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === updatedUser.id ? updatedUser : user
        )
      );

      toast.success('Usuário atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating user:', error);
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

      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      toast.success('Usuário excluído com sucesso!');
    } catch (error) {
      console.error('Error deleting user:', error);
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