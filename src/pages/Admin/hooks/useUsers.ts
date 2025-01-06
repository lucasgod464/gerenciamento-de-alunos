import { useState, useEffect } from "react";
import { User } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const { toast } = useToast();

  const loadUsers = async () => {
    try {
      console.log('Fetching users from database...');
      
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

      const usersWithSpecializations = await Promise.all(
        usersData.map(async (user) => {
          const { data: specializationsData } = await supabase
            .from('user_specializations')
            .select(`
              specializations (
                id,
                name
              )
            `)
            .eq('user_id', user.id);

          const specializations = specializationsData?.map(s => s.specializations.name).join(', ') || '';
          
          return {
            ...user,
            specialization: specializations
          };
        })
      );
      
      console.log('Users data received:', usersWithSpecializations);
      
      const mappedUsers = usersWithSpecializations.map(dbUser => ({
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.access_level as "ADMIN" | "USER",
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
      console.error('Error loading users:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de usuários.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      console.log('Dados a serem atualizados:', updatedUser);
      
      const { error } = await supabase
        .from('emails')
        .update({
          name: updatedUser.name,
          email: updatedUser.email,
          access_level: updatedUser.accessLevel,
          company_id: updatedUser.companyId,
          status: updatedUser.status,
          location: updatedUser.location,
          specialization: updatedUser.specialization,
          address: updatedUser.address
        })
        .eq('id', updatedUser.id);

      if (error) throw error;

      // Atualiza tags
      await supabase
        .from('user_tags')
        .delete()
        .eq('user_id', updatedUser.id);

      if (updatedUser.tags && updatedUser.tags.length > 0) {
        await supabase
          .from('user_tags')
          .insert(updatedUser.tags.map(tag => ({
            user_id: updatedUser.id,
            tag_id: tag.id
          })));
      }

      // Atualiza salas autorizadas
      await supabase
        .from('user_rooms')
        .delete()
        .eq('user_id', updatedUser.id);

      if (updatedUser.authorizedRooms && updatedUser.authorizedRooms.length > 0) {
        await supabase
          .from('user_rooms')
          .insert(updatedUser.authorizedRooms.map(room => ({
            user_id: updatedUser.id,
            room_id: room.id
          })));
      }

      // Atualiza o estado local imediatamente
      setUsers(prev => prev.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ));

      // Recarrega os dados para garantir sincronização
      await loadUsers();

      toast({
        title: "Usuário atualizado",
        description: "As informações do usuário foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Erro ao atualizar usuário",
        description: "Não foi possível atualizar as informações do usuário.",
        variant: "destructive",
      });
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
      toast({
        title: "Usuário excluído",
        description: "O usuário foi excluído com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Erro ao excluir usuário",
        description: "Não foi possível excluir o usuário.",
        variant: "destructive",
      });
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