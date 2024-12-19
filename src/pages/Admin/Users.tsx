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
  const [roomFilter, setRoomFilter] = useState("all");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const [specializations, setSpecializations] = useState<{ id: string; name: string }[]>([]);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const savedUsers = localStorage.getItem("users");
    const savedRooms = localStorage.getItem("rooms");
    const savedSpecializations = localStorage.getItem("specializations");

    if (savedUsers) {
      const parsedUsers = JSON.parse(savedUsers);
      // Filter users by company
      const companyUsers = parsedUsers.filter((user: any) => 
        user.companyId === currentUser?.companyId
      );
      
      const typedUsers = companyUsers.map((user: any) => ({
        ...user,
        status: (user.status === true || user.status === "active") ? "active" as const : "inactive" as const
      }));
      setUsers(typedUsers);
    }

    // Filter rooms by company
    if (savedRooms) {
      const allRooms = JSON.parse(savedRooms);
      const companyRooms = allRooms.filter((room: any) => 
        room.companyId === currentUser?.companyId
      );
      setRooms(companyRooms);
    }

    // Filter specializations by company
    if (savedSpecializations) {
      const allSpecializations = JSON.parse(savedSpecializations);
      const companySpecializations = allSpecializations.filter((spec: any) => 
        spec.companyId === currentUser?.companyId
      );
      setSpecializations(companySpecializations);
    }
  }, [currentUser]);

  const handleUpdateUser = (updatedUser: User) => {
    const newUsers = users.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );
    
    // Update in localStorage while preserving other companies' data
    const savedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const otherCompaniesUsers = savedUsers.filter((user: any) => 
      user.companyId !== currentUser?.companyId
    );
    
    localStorage.setItem("users", JSON.stringify([...otherCompaniesUsers, ...newUsers]));
    setUsers(newUsers);
    
    toast({
      title: "Usuário atualizado",
      description: "As informações do usuário foram atualizadas com sucesso.",
    });
  };

  const handleDeleteUser = (id: string) => {
    const newUsers = users.filter((user) => user.id !== id);
    
    // Update in localStorage while preserving other companies' data
    const savedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const otherCompaniesUsers = savedUsers.filter((user: any) => 
      user.companyId !== currentUser?.companyId
    );
    
    localStorage.setItem("users", JSON.stringify([...otherCompaniesUsers, ...newUsers]));
    setUsers(newUsers);
    
    toast({
      title: "Usuário excluído",
      description: "O usuário foi excluído com sucesso.",
      variant: "destructive",
    });
  };

  const handleCreateUser = (newUser: User) => {
    // Add company ID to new user
    const userWithCompany = {
      ...newUser,
      companyId: currentUser?.companyId
    };
    
    const updatedUsers = [...users, userWithCompany];
    
    // Update in localStorage while preserving other companies' data
    const savedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const otherCompaniesUsers = savedUsers.filter((user: any) => 
      user.companyId !== currentUser?.companyId
    );
    
    localStorage.setItem("users", JSON.stringify([...otherCompaniesUsers, ...updatedUsers]));
    setUsers(updatedUsers);
    
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
    const matchesRoom = roomFilter === "all" || user.responsibleRoom === roomFilter;
    const matchesSpecialization =
      specializationFilter === "all" || user.specialization === specializationFilter;

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
                <Select value={roomFilter} onValueChange={setRoomFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sala" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Salas</SelectItem>
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.name}
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