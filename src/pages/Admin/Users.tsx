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
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types/user";

type StatusFilter = "all" | "active" | "inactive";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [roomFilter, setRoomFilter] = useState<string>("all");
  const [specializationFilter, setSpecializationFilter] = useState<string>("all");
  const { toast } = useToast();

  // Carregar usuários do localStorage quando o componente montar
  useEffect(() => {
    const savedUsers = localStorage.getItem("users");
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  // Salvar usuários no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const handleCreateUser = (newUser: User) => {
    setUsers([...users, newUser]);
    toast({
      title: "Usuário criado",
      description: "O usuário foi criado com sucesso.",
    });
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(users.map((user) => 
      user.id === updatedUser.id ? updatedUser : user
    ));
    toast({
      title: "Usuário atualizado",
      description: "As informações do usuário foram atualizadas com sucesso.",
    });
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id));
    toast({
      title: "Usuário excluído",
      description: "O usuário foi excluído permanentemente.",
      variant: "destructive",
    });
  };

  const handleBulkAction = (action: "activate" | "deactivate") => {
    const updatedUsers = users.map((user) => ({
      ...user,
      status: action === "activate" ? "active" as const : "inactive" as const,
    }));
    setUsers(updatedUsers);
    toast({
      title: "Ação em massa concluída",
      description: `Os usuários selecionados foram ${action === "activate" ? "ativados" : "desativados"}.`,
    });
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesRoom = roomFilter === "all" || user.responsibleRoom === roomFilter;
    const matchesSpecialization = specializationFilter === "all" || user.specialization === specializationFilter;

    return matchesSearch && matchesStatus && matchesRoom && matchesSpecialization;
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

        <div className="flex justify-between items-center">
          <div className="space-x-2">
            <Button
              variant="secondary"
              onClick={() => handleBulkAction("activate")}
            >
              Ativar Selecionados
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleBulkAction("deactivate")}
            >
              Desativar Selecionados
            </Button>
          </div>
          <CreateUserDialog onUserCreated={handleCreateUser} />
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Input
            placeholder="Buscar usuários..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            value={statusFilter}
            onValueChange={(value: StatusFilter) => setStatusFilter(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="inactive">Inativo</SelectItem>
            </SelectContent>
          </Select>
          <Select value={roomFilter} onValueChange={setRoomFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por sala" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="sala1">Sala 1</SelectItem>
              <SelectItem value="sala2">Sala 2</SelectItem>
            </SelectContent>
          </Select>
          <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por especialização" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="esp1">Especialização 1</SelectItem>
              <SelectItem value="esp2">Especialização 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

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