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

    try {
      const { data: usersData, error } = await supabase
        .from('emails')
        .select(`
          *,
          companies (
            id,
            name,
            status
          ),
          user_authorized_rooms (
            room_id
          ),
          user_tags (
            tags (
              id,
              name,
              color
            )
          )
        `)
        .eq('company_id', currentUser.companyId);

      if (error) {
        console.error('Error fetching users:', error);
        return;
      }

      if (usersData) {
        const mappedUsers = usersData.map(user => {
          // Map authorized rooms
          const authorizedRooms = user.user_authorized_rooms?.map(ar => ar.room_id) || [];
          
          // Map tags
          const tags = user.user_tags?.map(ut => ({
            id: ut.tags.id,
            name: ut.tags.name,
            color: ut.tags.color
          })) || [];

          return {
            ...mapDatabaseUser(user),
            authorizedRooms,
            tags
          };
        });

        console.log('Fetched and mapped users:', mappedUsers);
        setUsers(mappedUsers);
      }
    } catch (error) {
      console.error('Error in fetchUsers:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentUser]);

  const handleUserUpdate = async (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    await fetchUsers(); // Refetch to ensure we have the latest data
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <UsersHeader onUserCreated={(user) => {
          setUsers(prev => [...prev, user]);
          fetchUsers(); // Refetch after creation
        }} />
        <UserList 
          users={users} 
          onUpdateUser={handleUserUpdate}
          onDeleteUser={(id) => {
            setUsers(users.filter(u => u.id !== id));
          }}
        />
      </div>
    </DashboardLayout>
  );
}