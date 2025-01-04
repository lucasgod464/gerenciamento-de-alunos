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
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">Usuários</h1>
        <p className="text-muted-foreground">
          Gerencie os usuários do sistema
        </p>
      </div>
      <Button onClick={() => setShowCreateDialog(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Novo Usuário
      </Button>

      <CreateUserDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onUserCreated={onUserCreated}
      />
    </div>
  );
};