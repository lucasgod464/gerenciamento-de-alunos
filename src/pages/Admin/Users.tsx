import { DashboardLayout } from "@/components/DashboardLayout";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UserList } from "@/components/users/UserList";
import { User } from "@/types/user";

const Users = () => {
  const handleUserCreated = (user: User) => {
    // Handle user creation
    console.log("User created:", user);
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <UsersHeader onUserCreated={handleUserCreated} />
        <UserList />
      </div>
    </DashboardLayout>
  );
};

export default Users;