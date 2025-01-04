import { Button } from "@/components/ui/button";
import { User } from "@/types/user";
import { Plus } from "lucide-react";

interface UsersHeaderProps {
  onAddUser: () => void;
}

export function UsersHeader({ onAddUser }: UsersHeaderProps) {
  return (
    <div className="flex items-center justify-between space-y-2">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Usuários</h2>
        <p className="text-muted-foreground">
          Gerencie os usuários do sistema
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Button onClick={onAddUser}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Usuário
        </Button>
      </div>
    </div>
  );
}