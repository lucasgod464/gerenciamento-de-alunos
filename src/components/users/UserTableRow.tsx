import { format } from "date-fns";
import { User } from "@/types/user";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

interface UserTableRowProps {
  user: User;
  onViewDetails: (user: User) => void;
  onEdit: (user: User) => void;
}

export function UserTableRow({ user, onViewDetails, onEdit }: UserTableRowProps) {
  return (
    <TableRow>
      <TableCell>{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.accessLevel}</TableCell>
      <TableCell>
        {format(new Date(user.createdAt), 'dd/MM/yyyy')}
      </TableCell>
      <TableCell>
        {user.lastAccess ? format(new Date(user.lastAccess), 'dd/MM/yyyy') : 'Nunca acessou'}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(user)}
          >
            Detalhes
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(user)}
          >
            Editar
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}