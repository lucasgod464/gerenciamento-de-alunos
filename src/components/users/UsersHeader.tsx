import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateUserDialog } from "./CreateUserDialog";
import { useState } from "react";
import { User } from "@/types/user";

export interface UsersHeaderProps {
  onUserCreated?: (user: User) => void;
}

export const UsersHeader = ({ onUserCreated }: UsersHeaderProps) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Usuários</h2>
        <p className="text-muted-foreground">
          Gerencie os usuários do sistema
        </p>
      </div>
      <Button onClick={() => setShowCreateDialog(true)}>
        <Plus className="mr-2 h-4 w-4" /> Adicionar Usuário
      </Button>

      <CreateUserDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onUserCreated={onUserCreated}
      />
    </div>
  );
};