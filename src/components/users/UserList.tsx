import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@/types/user";
import { UserTableRow } from "./UserTableRow";
import { EditUserDialog } from "./EditUserDialog";
import { useState } from "react";

interface UserListProps {
  users: User[];
  onUpdateUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
}

export function UserList({ users, onUpdateUser, onDeleteUser }: UserListProps) {
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleStatusChange = (id: string, checked: boolean) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      onUpdateUser({
        ...user,
        status: checked ? "active" : "inactive",
      });
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome Completo</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Categoria Responsável</TableHead>
            <TableHead>Especialização</TableHead>
            <TableHead>Salas Autorizadas</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data de Cadastro</TableHead>
            <TableHead>Último Acesso</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              onEdit={setEditingUser}
              onDelete={onDeleteUser}
              onStatusChange={handleStatusChange}
            />
          ))}
        </TableBody>
      </Table>

      <EditUserDialog
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSubmit={onUpdateUser}
      />
    </>
  );
}