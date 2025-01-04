import { CreateUserDialog } from "./CreateUserDialog";

export const UsersHeader = () => {
  const handleUserAdded = () => {
    // Handle user added
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Usuários</h2>
        <p className="text-muted-foreground">
          Gerencie os usuários do sistema
        </p>
      </div>
      <CreateUserDialog onUserAdded={handleUserAdded} />
    </div>
  );
};