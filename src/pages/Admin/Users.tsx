import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { CreateUserDialog } from "@/components/users/CreateUserDialog";
import { UserList } from "@/components/users/UserList";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/user";
import { Card, CardContent } from "@/components/ui/card";

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

    // Load company-specific users
    const loadUsers = () => {
      const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
      console.log("All users from localStorage:", allUsers);
      const companyUsers = allUsers.filter((user: User) => user.companyId === currentUser.companyId);
      console.log("Filtered company users:", companyUsers);
      setUsers(companyUsers);
    };

    // Initial load
    loadUsers();

    // Set up localStorage event listener
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "users") {
        loadUsers();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [currentUser]);

  const handleUpdateUser = (updatedUser: User) => {
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const otherUsers = allUsers.filter(
      (user: User) => user.id !== updatedUser.id
    );
    
    localStorage.setItem("users", JSON.stringify([...otherUsers, updatedUser]));
    
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

  const handleCreateUser = (newUser: User) => {
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = [...allUsers, newUser];
    
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    
    setUsers(prevUsers => [...prevUsers, newUser]);
    
    toast({
      title: "Usuário criado",
      description: "O novo usuário foi criado com sucesso.",
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
        <div>
          <h1 className="text-2xl font-bold mb-2">Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie os usuários do sistema
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-6">
              <div className="flex justify-end">
                <CreateUserDialog onUserCreated={handleCreateUser} />
              </div>

              <div className="grid gap-4 md:grid-cols-5">
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="md:col-span-2"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Categorias</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={specializationFilter}
                  onValueChange={setSpecializationFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Especialização" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Especializações</SelectItem>
                    {specializations.map((spec) => (
                      <SelectItem key={spec.id} value={spec.id}>
                        {spec.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

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