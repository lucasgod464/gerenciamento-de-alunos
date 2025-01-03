import { DashboardLayout } from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { UserList } from "@/components/users/UserList";
import { mapDatabaseUser } from "@/types/user";
import { UsersHeader } from "@/components/users/UsersHeader";

export default function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);

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
        <UsersHeader onUserCreated={(user) => {
          setUsers(prev => [...prev, user]);
        }} />
        <UserList 
          users={users} 
          onUpdateUser={(user) => {
            setUsers(users.map(u => u.id === user.id ? user : u));
          }}
          onDeleteUser={(id) => {
            setUsers(users.filter(u => u.id !== id));
          }}
        />
      </div>
    </DashboardLayout>
  );
}