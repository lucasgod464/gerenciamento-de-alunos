import { Button } from "@/components/ui/button";
import { CreateUserDialog } from "./CreateUserDialog";
import { User } from "@/types/user";

interface UsersHeaderProps {
  onUserCreated: (user: User) => void;
}

export function UsersHeader({ onUserCreated }: UsersHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Usuários</h1>
      <p className="text-muted-foreground">
        Gerencie os usuários do sistema
      </p>
      <div className="mt-6 flex justify-end">
        <CreateUserDialog onUserCreated={onUserCreated} />
      </div>
    </div>
  );
}