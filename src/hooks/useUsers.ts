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
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Erro ao carregar lista de usuários');
    }
  };

  const handleUpdateUser = async (userData: User) => {
    if (!userData || !userData.id) {
      console.error('Dados do usuário ou ID não fornecidos');
      toast.error('Dados do usuário inválidos');
      return;
    }

    try {
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

      await loadUsers();
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