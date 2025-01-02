import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { UserList } from "@/components/users/UserList";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { User, mapDatabaseAccessLevelToAccessLevel } from "@/types/user";
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
    queryKey: ["company-emails", currentUser?.companyId],
    queryFn: async () => {
      if (!currentUser?.companyId) return [];

      const { data: emailsData, error } = await supabase
        .from('emails')
        .select(`
          id,
          name,
          email,
          access_level,
          company_id,
          created_at,
          updated_at,
          location,
          specialization
        `)
        .eq('company_id', currentUser.companyId);

      if (error) {
        console.error('Error fetching emails:', error);
        throw error;
      }

      return emailsData.map((email): User => ({
        id: email.id,
        name: email.name,
        email: email.email,
        role: mapDatabaseAccessLevelToAccessLevel(email.access_level),
        company_id: email.company_id,
        created_at: email.created_at,
        last_access: email.updated_at,
        status: 'active',
        access_level: email.access_level,
        location: email.location,
        specialization: email.specialization,
        password: '',
      }));
    },
    enabled: !!currentUser?.companyId,
  });

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      const { error } = await supabase
        .from('emails')
        .update({
          name: updatedUser.name,
          email: updatedUser.email,
          access_level: updatedUser.access_level,
          location: updatedUser.location,
          specialization: updatedUser.specialization,
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
      const { error: authRoomsError } = await supabase
        .from('user_authorized_rooms')
        .delete()
        .eq('user_id', id);

      if (authRoomsError) throw authRoomsError;

      const { error } = await supabase
        .from('emails')
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
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "active" && user.access_level !== "Inativo") ||
      (statusFilter === "inactive" && user.access_level === "Inativo");

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