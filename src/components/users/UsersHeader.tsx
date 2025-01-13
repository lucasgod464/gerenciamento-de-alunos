import { CreateUserDialog } from "./CreateUserDialog";

interface UsersHeaderProps {
  onUserCreated: () => void;
}

export const UsersHeader = ({ onUserCreated }: UsersHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Usuários</h2>
        <p className="text-muted-foreground">
          Gerencie os usuários do sistema
        </p>
      </div>
      <CreateUserDialog onUserCreated={onUserCreated} />
    </div>
  );
};
