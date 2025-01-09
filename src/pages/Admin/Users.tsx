import { DashboardLayout } from "@/components/DashboardLayout";
import { UserList } from "@/components/users/UserList";
import { useState } from "react";
import { UsersFilters } from "@/components/users/UsersFilters";
import { UserStats } from "@/components/users/UserStats";
import { useUsers } from "@/hooks/useUsers";
import { User } from "@/types/user";

const Users = () => {
  const { users, loadUsers, handleUpdateUser, handleDeleteUser } = useUsers();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

  const handleUserUpdate = async (userData: User) => {
    await handleUpdateUser(userData);
  };

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
          onUpdateUser={handleUserUpdate}
          onDeleteUser={handleDeleteUser}
        />
      </div>
    </DashboardLayout>
  );
};

export default Users;