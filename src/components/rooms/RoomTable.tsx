import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Room } from "@/types/room";
import { User } from "@/types/user";

interface Category {
  id: string;
  name: string;
  status: boolean;
  companyId: string | null;
}

interface RoomTableProps {
  rooms: Room[];
  onEdit: (room: Room) => void;
  onDelete: (id: string) => void;
}

export function RoomTable({ rooms, onEdit, onDelete }: RoomTableProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.companyId) return;
    
    const allCategories = JSON.parse(localStorage.getItem("categories") || "[]");
    const companyCategories = allCategories.filter(
      (cat: Category) => cat.companyId === user.companyId
    );
    setCategories(companyCategories);

    // Carregar usuários
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const companyUsers = allUsers.filter(
      (u: User) => u.companyId === user.companyId
    );
    setUsers(companyUsers);
  }, [user]);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Sem categoria";
  };

  const getAuthorizedUsers = (room: Room) => {
    const authorizedUsers = users.filter(user => 
      room.authorizedUsers?.includes(user.id)
    );
    return authorizedUsers.map(user => user.name).join(", ") || "Nenhum usuário vinculado";
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome da Sala</TableHead>
          <TableHead>Horário</TableHead>
          <TableHead>Endereço</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Usuários Vinculados</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rooms.map((room) => (
          <TableRow key={room.id}>
            <TableCell>{room.name}</TableCell>
            <TableCell>{room.schedule}</TableCell>
            <TableCell>{room.location}</TableCell>
            <TableCell>{getCategoryName(room.category)}</TableCell>
            <TableCell>{getAuthorizedUsers(room)}</TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  room.status
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {room.status ? "Ativa" : "Inativa"}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(room)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(room.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}