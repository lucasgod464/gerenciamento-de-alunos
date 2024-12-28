import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { UserList } from "@/components/users/UserList";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/user";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UsersFilters } from "@/components/users/UsersFilters";
import { useQuery } from "@tanstack/react-query";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  // Buscar usuários criados pelo Super Admin
  const { data: superAdminCreatedUsers = [] } = useQuery({
    queryKey: ["createdEmails"],
    queryFn: () => {
      const storedEmails = localStorage.getItem("createdEmails") || "[]";
      const emails = JSON.parse(storedEmails);
      return emails.filter((email: any) => 
        email.accessLevel === "Usuário Comum" && 
        email.company === currentUser?.companyId
      ).map((email: any) => ({
        id: email.id,
        name: email.name,
        email: email.email,
        password: email.password,
        responsibleCategory: "",
        location: "",
        specialization: "",
        status: "active",
        createdAt: email.createdAt,
        lastAccess: "-",
        companyId: email.company,
        authorizedRooms: []
      }));
    }
  });

  useEffect(() => {
    if (!currentUser?.companyId) return;

    const loadUsers = () => {
      const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const adminCreatedUsers = allUsers.filter((user: User) => 
        user.companyId === currentUser.companyId
      );
      
      // Combinar usuários criados pelo admin com usuários criados pelo super admin
      const combinedUsers = [...adminCreatedUsers, ...superAdminCreatedUsers];
      
      // Remover duplicatas baseado no email
      const uniqueUsers = combinedUsers.reduce((acc: User[], current: User) => {
        const exists = acc.find(user => user.email === current.email);
        if (!exists) {
          acc.push(current);
        }
        return acc;
      }, []);
      
      setUsers(uniqueUsers);
    };

    loadUsers();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "users" || e.key === "createdEmails") {
        loadUsers();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [currentUser, superAdminCreatedUsers]);

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

    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <UsersHeader onUserCreated={(user) => setUsers([...users, user])} />
        
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