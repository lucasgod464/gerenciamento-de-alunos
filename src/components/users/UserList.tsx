import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User } from "@/types/user";
import { UserTableRow } from "./UserTableRow";
import { EditUserDialog } from "./EditUserDialog";
import { UserInfoDialog } from "./UserInfoDialog";
import { useState } from "react";
import { useUsers } from "@/hooks/useUsers";

interface UserListProps {
  users: User[];
  onUpdateUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
}

export function UserList({ users, onUpdateUser, onDeleteUser }: UserListProps) {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { loadUsers } = useUsers();

  const handleStatusChange = async (id: string, checked: boolean) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      onUpdateUser({
        ...user,
        status: checked ? "active" : "inactive",
      });
      await loadUsers(); // Recarrega a lista após mudança de status
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleUserUpdate = async (updatedUser: User) => {
    onUpdateUser(updatedUser);
    setIsEditDialogOpen(false);
    await loadUsers(); // Recarrega a lista após atualização
  };

  const handleViewClick = (user: User) => {
    setViewingUser(user);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Nome Completo</TableHead>
            <TableHead className="w-[200px]">Email</TableHead>
            <TableHead className="w-[200px]">Salas Autorizadas</TableHead>
            <TableHead className="w-[150px]">Etiquetas</TableHead>
            <TableHead className="w-[100px] text-center">Status</TableHead>
            <TableHead className="w-[120px]">Cadastro</TableHead>
            <TableHead className="w-[120px]">Último Acesso</TableHead>
            <TableHead className="w-[120px] text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              onEdit={() => handleEditClick(user)}
              onDelete={onDeleteUser}
              onView={() => handleViewClick(user)}
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

      <UserInfoDialog
        user={viewingUser}
        onClose={() => setViewingUser(null)}
      />
    </>
  );
}