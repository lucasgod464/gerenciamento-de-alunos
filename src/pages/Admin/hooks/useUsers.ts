import { useState, useEffect } from "react";
import { User, UserResponse, mapSupabaseUser } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { userService } from "@/services/userService";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  const loadUsers = async () => {
    if (!currentUser?.companyId) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          user_tags (tag_id),
          user_rooms (room_id),
          user_specializations (specialization_id)
        `)
        .eq('company_id', currentUser.companyId);

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Ocorreu um erro ao carregar a lista de usuários.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUser = async (userData: Partial<User>) => {
    if (!userData.id) return;

    try {
      // 1. Atualiza informações básicas do usuário
      const { error: userError } = await supabase
        .from('users')
        .update({
          name: userData.name,
          email: userData.email,
          status: userData.status,
          // ... outros campos básicos
        })
        .eq('id', userData.id);

      if (userError) throw userError;

      // 2. Atualiza tags
      if (userData.tags) {
        await supabase
          .from('user_tags')
          .delete()
          .eq('user_id', userData.id);

        if (userData.tags.length > 0) {
          await supabase
            .from('user_tags')
            .insert(userData.tags.map(tagId => ({
              user_id: userData.id,
              tag_id: tagId
            })));
        }
      }

      // 3. Atualiza salas
      if (userData.rooms) {
        await supabase
          .from('user_rooms')
          .delete()
          .eq('user_id', userData.id);

        if (userData.rooms.length > 0) {
          await supabase
            .from('user_rooms')
            .insert(userData.rooms.map(roomId => ({
              user_id: userData.id,
              room_id: roomId
            })));
        }
      }

      // 4. Atualiza especializações
      if (userData.specializations) {
        await supabase
          .from('user_specializations')
          .delete()
          .eq('user_id', userData.id);

        if (userData.specializations.length > 0) {
          await supabase
            .from('user_specializations')
            .insert(userData.specializations.map(specId => ({
              user_id: userData.id,
              specialization_id: specId
            })));
        }
      }

      // 5. Atualiza o estado local imediatamente
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userData.id 
            ? { ...user, ...userData }
            : user
        )
      );

      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso!",
      });

      // 6. Recarrega os dados para garantir sincronização
      await loadUsers();

    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Erro ao atualizar usuário",
        description: "Ocorreu um erro ao atualizar o usuário.",
        variant: "destructive",
      });
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
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      // Atualiza o estado local
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));

      toast({
        title: "Sucesso",
        description: "Usuário excluído com sucesso!",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Erro ao excluir usuário",
        description: "Ocorreu um erro ao excluir o usuário.",
        variant: "destructive",
      });
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
};