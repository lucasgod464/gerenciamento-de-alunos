import { DashboardLayout } from "@/components/DashboardLayout";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UserList } from "@/components/users/UserList";
import { useEffect, useState } from "react";
import { User, mapDatabaseUser } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { toast } = useToast();

  const loadUsers = async () => {
    try {
      const { data: dbUsers, error } = await supabase
        .from('emails')
        .select('*');

      if (error) throw error;

      const mappedUsers = dbUsers.map(mapDatabaseUser);
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de usuários.",
        variant: "destructive",
      });
    }
  };

  const handleUserCreated = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
    toast({
      title: "Usuário criado",
      description: "O usuário foi criado com sucesso.",
    });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <UsersHeader onUserCreated={handleUserCreated} />
        <UserList users={users} onUserUpdated={loadUsers} />
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;