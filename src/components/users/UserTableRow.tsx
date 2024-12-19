import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2 } from "lucide-react";
import { User } from "@/types/user";

interface UserTableRowProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, checked: boolean) => void;
}

export function UserTableRow({ user, onEdit, onDelete, onStatusChange }: UserTableRowProps) {
  return (
    <TableRow>
      <TableCell>{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.responsibleRoom}</TableCell>
      <TableCell>{user.specialization}</TableCell>
      <TableCell>
        <Switch
          checked={user.status === "active"}
          onCheckedChange={(checked) => onStatusChange(user.id, checked)}
        />
      </TableCell>
      <TableCell>{user.createdAt}</TableCell>
      <TableCell>{user.lastAccess}</TableCell>
      <TableCell>
        <div className="flex space-x-2">
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
      </TableCell>
    </TableRow>
  );
}