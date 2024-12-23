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
import { ScrollArea } from "@/components/ui/scroll-area";

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

    const updatedUser: User = {
      ...editingUser,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
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
      <ScrollArea className="relative w-full">
        <Table>
          <TableHeader className="sticky top-0 bg-card">
            <TableRow>
              <TableHead className="w-[200px]">Nome Completo</TableHead>
              <TableHead className="w-[200px]">Email</TableHead>
              <TableHead className="w-[150px]">Categoria Responsável</TableHead>
              <TableHead className="w-[150px]">Especialização</TableHead>
              <TableHead className="w-[150px]">Salas Autorizadas</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[120px]">Data de Cadastro</TableHead>
              <TableHead className="w-[120px]">Último Acesso</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
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
      </ScrollArea>

      <EditUserDialog
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSubmit={handleEditSubmit}
      />
    </>
  );
}