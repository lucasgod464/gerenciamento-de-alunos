import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { User } from "@/types/user";

interface UserActionsProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

export const UserActions = ({ user, onEdit, onDelete }: UserActionsProps) => {
  return (
    <div className="flex justify-center space-x-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEdit(user)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(user.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};