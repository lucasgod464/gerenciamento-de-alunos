import { useState, useEffect } from "react";
import { CreateUserDialog } from "@/components/users/CreateUserDialog";
import { UserList } from "@/components/users/UserList";
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
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'emails'
        },
        (payload) => {
          console.log('Mudança detectada na tabela emails:', payload);
          loadUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadUsers]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      (user.location || '').toLowerCase().includes(search.toLowerCase()) ||
      (user.specialization || '').toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === 'active').length;
  const inactiveUsers = users.filter(user => user.status === 'inactive').length;

  const handleUserUpdate = async (userData: User) => {
    console.log('Atualizando usuário:', userData);
    await handleUpdateUser(userData);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Usuários</h1>
      <p className="text-muted-foreground">Gerencie os usuários do sistema</p>

      <UserStats
        totalUsers={totalUsers}
        activeUsers={activeUsers}
        inactiveUsers={inactiveUsers}
      />

      <div className="flex justify-between items-center gap-4">
        <UsersFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
        <CreateUserDialog onUserCreated={loadUsers} />
      </div>

      <UserList
        users={filteredUsers}
        onUserUpdate={handleUserUpdate}
        onUserDelete={handleDeleteUser}
      />
    </div>
  );
};

export default Users;