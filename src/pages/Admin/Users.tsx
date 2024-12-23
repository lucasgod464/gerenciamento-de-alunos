import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { UserList } from "@/components/users/UserList";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/user";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UsersFilters } from "@/components/users/UsersFilters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [categories] = useState<{ id: string; name: string }[]>([]);
  const [specializations] = useState<{ id: string; name: string }[]>([]);
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
      <div className="space-y-4">
        <UsersHeader onUserCreated={(user) => setUsers([...users, user])} />
        
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="w-full border-b rounded-none px-0 h-12">
            <TabsTrigger 
              value="list" 
              className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              Lista de Usuários
            </TabsTrigger>
            <TabsTrigger 
              value="filters" 
              className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              Filtros
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-4">
            <Card className="border-0 shadow-none">
              <UserList
                users={filteredUsers}
                onUpdateUser={(updatedUser) => {
                  const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
                  const otherUsers = allUsers.filter((u: User) => u.id !== updatedUser.id);
                  const updatedUsers = [...otherUsers, updatedUser];
                  localStorage.setItem("users", JSON.stringify(updatedUsers));
                  setUsers(prevUsers =>
                    prevUsers.map(user => user.id === updatedUser.id ? updatedUser : user)
                  );
                  toast({
                    title: "Usuário atualizado",
                    description: "As informações do usuário foram atualizadas com sucesso.",
                  });
                }}
                onDeleteUser={(id) => {
                  const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
                  const updatedUsers = allUsers.filter((user: User) => user.id !== id);
                  localStorage.setItem("users", JSON.stringify(updatedUsers));
                  setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
                  toast({
                    title: "Usuário excluído",
                    description: "O usuário foi excluído com sucesso.",
                    variant: "destructive",
                  });
                }}
              />
            </Card>
          </TabsContent>

          <TabsContent value="filters" className="mt-4">
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
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Users;