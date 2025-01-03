import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { UserList } from "@/components/users/UserList";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { User, AccessLevel } from "@/types/user";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UsersFilters } from "@/components/users/UsersFilters";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Users = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  // Usar useQuery para gerenciamento de cache e revalidação automática
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users", currentUser?.companyId],
    queryFn: async () => {
      if (!currentUser?.companyId) return [];

      const { data: usersData, error } = await supabase
        .from('users')
        .select(`
          id,
          name,
          email,
          access_level,
          company_id,
          created_at,
          updated_at,
          location,
          specialization,
          status
        `)
        .eq('company_id', currentUser.companyId);

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      return usersData.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.access_level === 'Admin' ? 'ADMIN' : 'USER',
        company_id: user.company_id,
        created_at: user.created_at,
        last_access: user.updated_at,
        status: user.status === 'inactive' ? 'inactive' as const : 'active' as const,
        access_level: user.access_level as AccessLevel,
        location: user.location,
        specialization: user.specialization,
        password: '',
      }));
    },
    enabled: !!currentUser?.companyId,
  });

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: updatedUser.name,
          email: updatedUser.email,
          access_level: updatedUser.access_level,
          location: updatedUser.location,
          specialization: updatedUser.specialization,
          status: updatedUser.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedUser.id);

      if (error) throw error;

      // Invalidar o cache para forçar uma nova busca
      await queryClient.invalidateQueries(["users", currentUser?.companyId]);
      
      toast({
        title: "Usuário atualizado",
        description: "As informações do usuário foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar o usuário.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      // Primeiro, deletar registros relacionados
      await Promise.all([
        supabase
          .from('user_authorized_rooms')
          .delete()
          .eq('user_id', id),
        supabase
          .from('user_specializations')
          .delete()
          .eq('user_id', id)
      ]);

      // Então deletar o usuário
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Invalidar o cache para forçar uma nova busca
      await queryClient.invalidateQueries(["users", currentUser?.companyId]);
      
      toast({
        title: "Usuário excluído",
        description: "O usuário foi excluído com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o usuário.",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "active" && user.status === "active") ||
      (statusFilter === "inactive" && user.status === "inactive");

    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <UsersHeader onUserCreated={() => queryClient.invalidateQueries(["users", currentUser?.companyId])} />
        
        <UsersFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        <UserList
          users={filteredUsers}
          onUpdateUser={handleUpdateUser}
          onDeleteUser={handleDeleteUser}
          isLoading={isLoading}
        />
      </div>
    </DashboardLayout>
  );
};

export default Users;
