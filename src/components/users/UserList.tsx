import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  id: string;
  name: string;
  email: string;
  responsibleRoom: string;
  location: string;
  specialization: string;
  status: "active" | "inactive";
  createdAt: string;
  lastAccess: string;
}

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
    const updatedUser = {
      ...editingUser,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      responsibleRoom: formData.get("responsibleRoom") as string,
      location: formData.get("location") as string,
      specialization: formData.get("specialization") as string,
      status: formData.get("status") as "active" | "inactive",
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
            <TableHead>Sala Responsável</TableHead>
            <TableHead>Especialização</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data de Cadastro</TableHead>
            <TableHead>Último Acesso</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.responsibleRoom}</TableCell>
              <TableCell>{user.specialization}</TableCell>
              <TableCell>
                <Switch
                  checked={user.status === "active"}
                  onCheckedChange={(checked) => handleStatusChange(user.id, checked)}
                />
              </TableCell>
              <TableCell>{user.createdAt}</TableCell>
              <TableCell>{user.lastAccess}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingUser(user)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteUser(user.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingUser.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={editingUser.email}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsibleRoom">Sala Responsável</Label>
                <Select name="responsibleRoom" defaultValue={editingUser.responsibleRoom}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sala1">Sala 1</SelectItem>
                    <SelectItem value="sala2">Sala 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Local</Label>
                <Input
                  id="location"
                  name="location"
                  defaultValue={editingUser.location}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Especialização</Label>
                <Select name="specialization" defaultValue={editingUser.specialization}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="esp1">Especialização 1</SelectItem>
                    <SelectItem value="esp2">Especialização 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={editingUser.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingUser(null)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}