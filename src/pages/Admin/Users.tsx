import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { UserList } from "@/components/users/UserList";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/user";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UsersFilters } from "@/components/users/UsersFilters";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [specializations, setSpecializations] = useState<{ id: string; name: string }[]>([]);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.companyId) return;

    const loadUsers = () => {
      const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const uniqueUsers = allUsers.reduce((acc: User[], current: User) => {
        const exists = acc.find((user) => user.id === current.id);
        if (!exists && current.companyId === currentUser.companyId) {
          acc.push(current);
        }
        return acc;
      }, []);
      
      setUsers(uniqueUsers);
    };

    loadUsers();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "users") {
        loadUsers();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [currentUser]);

  const handleUpdateUser = (updatedUser: User) => {
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const otherUsers = allUsers.filter((user: User) => user.id !== updatedUser.id);
    const updatedUsers = [...otherUsers, updatedUser];
    
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(prevUsers =>
      prevUsers.map(user => user.id === updatedUser.id ? updatedUser : user)
    );
    
    toast({
      title: "Usuário atualizado",
      description: "As informações do usuário foram atualizadas com sucesso.",
    });
  };

  const handleDeleteUser = (id: string) => {
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = allUsers.filter((user: User) => user.id !== id);
    
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
    
    toast({
      title: "Usuário excluído",
      description: "O usuário foi excluído com sucesso.",
      variant: "destructive",
    });
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || user.responsibleCategory === categoryFilter;
    const matchesSpecialization =
      specializationFilter === "all" || user.specialization === specializationFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesSpecialization;
  });

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie os usuários do sistema
          </p>
        </div>

        <div className="space-y-4">
          <UsersHeader onUserCreated={(user) => setUsers([...users, user])} />
          
          <UsersFilters
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            specializationFilter={specializationFilter}
            onSpecializationFilterChange={setSpecializationFilter}
            categories={categories}
            specializations={specializations}
          />

          <UserList
            users={filteredUsers}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Users;
