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

  const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingUser) return;

    const formData = new FormData(event.currentTarget);
    const authorizedRoomsStr = formData.get("authorizedRooms") as string;
    const authorizedRooms = authorizedRoomsStr ? JSON.parse(authorizedRoomsStr) : [];
    const password = formData.get("password") as string;

    const updatedUser: User = {
      ...editingUser,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: password,
      responsibleCategory: formData.get("responsibleCategory") as string,
      location: formData.get("location") as string,
      specialization: formData.get("specialization") as string,
      status: formData.get("status") as "active" | "inactive",
      authorizedRooms: authorizedRooms,
    };

    onUpdateUser(updatedUser);
    setEditingUser(null);
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
        onSubmit={handleEditSubmit}
      />
    </>
  );
}