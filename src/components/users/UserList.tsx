import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleStatusChange = (id: string, checked: boolean) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      onUpdateUser({
        ...user,
        status: checked ? "active" : "inactive",
      });
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleUserUpdate = (updatedUser: User) => {
    onUpdateUser(updatedUser);
    setIsEditDialogOpen(false);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Nome Completo</TableHead>
            <TableHead className="w-[200px]">Email</TableHead>
            <TableHead className="w-[150px]">Especialização</TableHead>
            <TableHead className="w-[200px]">Salas Autorizadas</TableHead>
            <TableHead className="w-[150px]">Etiquetas</TableHead>
            <TableHead className="w-[100px] text-center">Status</TableHead>
            <TableHead className="w-[120px]">Cadastro</TableHead>
            <TableHead className="w-[120px]">Último Acesso</TableHead>
            <TableHead className="w-[100px] text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              onEdit={() => handleEditClick(user)}
              onDelete={onDeleteUser}
              onStatusChange={handleStatusChange}
            />
          ))}
        </TableBody>
      </Table>

      <EditUserDialog
        user={editingUser}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUserUpdated={handleUserUpdate}
      />
    </>
  );
}