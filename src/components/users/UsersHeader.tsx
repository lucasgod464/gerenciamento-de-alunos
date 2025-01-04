import { CreateUserDialog } from "./CreateUserDialog";
import { User } from "@/types/user";

interface UsersHeaderProps {
  onUserCreated: (user: User) => void;
}

export function UsersHeader({ onUserCreated }: UsersHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Usuários</h1>
        <p className="text-muted-foreground">
          Gerencie os usuários do sistema
        </p>
      </div>
      <CreateUserDialog onUserCreated={onUserCreated} />
    </div>
  );
}