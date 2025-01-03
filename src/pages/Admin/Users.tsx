import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { UserList } from "@/components/users/UserList";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types/user";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UsersFilters } from "@/components/users/UsersFilters";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Users = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const { data: users = [], refetch } = useQuery({
    queryKey: ["company-emails"],
    queryFn: async () => {
      const { data: emailsData, error } = await supabase
        .from('emails')
        .select(`
          *,
          user_authorized_rooms (
            room_id
          ),
          user_tags (
            tags (
              id,
              name,
              color
            )
          )
        `);

      if (error) {
        console.error('Error fetching emails:', error);
        throw error;
      }

      return emailsData.map(email => ({
        id: email.id,
        name: email.name,
        email: email.email,
        role: email.access_level === 'Admin' ? 'ADMIN' : 'USER',
        company_id: email.company_id,
        created_at: email.created_at,
        last_access: email.updated_at,
        status: email.status === 'active' ? 'active' as const : 'inactive' as const,
        access_level: email.access_level,
        location: email.location,
        specialization: email.specialization,
        password: '',
        authorizedRooms: email.user_authorized_rooms?.map(r => r.room_id) || [],
        tags: email.user_tags?.map(ut => ut.tags) || [],
      }));
    },
  });

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      await refetch();
      
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
      // First delete related records
      await supabase.from('user_authorized_rooms').delete().eq('user_id', id);
      await supabase.from('user_tags').delete().eq('user_id', id);
      
      // Then delete the user
      const { error } = await supabase
        .from('emails')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await refetch();
      
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