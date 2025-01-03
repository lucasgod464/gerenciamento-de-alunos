import { DashboardLayout } from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { UserList } from "@/components/users/UserList";
import { mapDatabaseUser } from "@/types/user";

export default function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    if (!currentUser?.companyId) return;

    const { data: usersData, error } = await supabase
      .from('emails')
      .select(`
        *,
        companies (
          id,
          name,
          status
        )
      `)
      .eq('company_id', currentUser.companyId);

    if (error) {
      console.error('Error fetching users:', error);
      return;
    }

    if (usersData) {
      setUsers(usersData.map(user => mapDatabaseUser(user)));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentUser]);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie os usuários do sistema
          </p>
        </div>
        <UserList users={users} />
      </div>
    </DashboardLayout>
  );
}