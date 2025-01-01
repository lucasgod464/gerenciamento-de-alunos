import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { UserList } from "@/components/users/UserList";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/user";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UsersFilters } from "@/components/users/UsersFilters";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Users = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  const { data: users = [], refetch } = useQuery({
    queryKey: ["users", currentUser?.companyId],
    queryFn: async () => {
      if (!currentUser?.companyId) return [];

      const { data: usersData, error } = await supabase
        .from('users')
        .select(`
          *,
          user_authorized_rooms (
            room_id
          ),
          user_tags (
            tag_id
          )
        `)
        .eq('company_id', currentUser.companyId);

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      return usersData.map(user => ({
        ...user,
        authorizedRooms: user.user_authorized_rooms?.map(r => r.room_id) || [],
        tags: user.user_tags?.map(t => t.tag_id) || [],
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
          status: updatedUser.status,
        })
        .eq('id', updatedUser.id);

      if (error) throw error;

      refetch();
      
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
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;

      refetch();
      
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
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <UsersHeader onUserCreated={() => refetch()} />
        
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
        />
      </div>
    </DashboardLayout>
  );
};

export default Users;