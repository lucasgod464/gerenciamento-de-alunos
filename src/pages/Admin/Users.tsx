import { DashboardLayout } from "@/components/DashboardLayout";
import { UserList } from "@/components/users/UserList";
import { useState, useEffect } from "react";
import { UsersFilters } from "@/components/users/UsersFilters";
import { UserStats } from "@/components/users/UserStats";
import { useUsers } from "@/hooks/useUsers";
import { User } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";

const Users = () => {
  const { users, loadUsers, handleUpdateUser, handleDeleteUser } = useUsers();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Implementar escuta de mudanças em tempo real
  useEffect(() => {
    console.log('Configurando listener de mudanças em tempo real...');
    
    // Primeiro, vamos garantir que a tabela emails tenha REPLICA IDENTITY FULL
    const channel = supabase
      .channel('user-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Escuta todos os eventos (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'emails',
          filter: `company_id=eq.${users[0]?.companyId}`
        },
        async (payload) => {
          console.log('Mudança detectada:', payload);
          if (payload.eventType === 'UPDATE') {
            console.log('Usuário atualizado, recarregando lista...');
            await loadUsers(); // Recarrega a lista quando houver qualquer mudança
          }
        }
      )
      .subscribe((status) => {
        console.log('Status da inscrição:', status);
      });

    return () => {
      console.log('Removendo listener...');
      supabase.removeChannel(channel);
    };
  }, [loadUsers, users]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
                         user.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.status === 'active') ||
                         (statusFilter === 'inactive' && user.status === 'inactive');
    return matchesSearch && matchesStatus;
  });

  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === 'active').length;
  const inactiveUsers = users.filter(user => user.status === 'inactive').length;

  return (
    <DashboardLayout role="admin">
      <div className="max-w-6xl mx-auto space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Usuários</h2>
          <p className="text-muted-foreground">
            Gerencie os usuários do sistema
          </p>
        </div>
        <UserStats 
          totalUsers={totalUsers}
          activeUsers={activeUsers}
          inactiveUsers={inactiveUsers}
        />
        <UsersFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onUserCreated={loadUsers}
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