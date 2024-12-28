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
import { Pencil, Trash2, Users, List } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Room } from "@/types/room";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
  const [selectedRoomStudents, setSelectedRoomStudents] = useState<any[]>([]);
  const [isStudentsDialogOpen, setIsStudentsDialogOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.companyId) return;
    
    const allCategories = JSON.parse(localStorage.getItem("categories") || "[]");
    const companyCategories = allCategories.filter(
      (cat: Category) => cat.companyId === user.companyId
    );
    setCategories(companyCategories);
  }, [user]);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Sem categoria";
  };

  const getAuthorizedUsers = (room: Room) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const authorizedUsers = users.filter((user: any) => 
      user.authorizedRooms?.includes(room.id)
    );
    return authorizedUsers.map((user: any) => user.name).join(", ") || "Nenhum usuário vinculado";
  };

  const handleViewStudents = (roomId: string) => {
    const allStudents = JSON.parse(localStorage.getItem("students") || "[]");
    const roomStudents = allStudents.filter((student: any) => student.room === roomId);
    setSelectedRoomStudents(roomStudents);
    setIsStudentsDialogOpen(true);
  };

  return (
    <>
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
              <TableCell>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{getAuthorizedUsers(room)}</span>
                </div>
              </TableCell>
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
                  onClick={() => handleViewStudents(room.id)}
                  title="Ver alunos"
                >
                  <List className="h-4 w-4" />
                </Button>
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

      <Dialog open={isStudentsDialogOpen} onOpenChange={setIsStudentsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alunos da Sala</DialogTitle>
            <DialogDescription>
              Lista de alunos matriculados nesta sala
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {selectedRoomStudents.length > 0 ? (
              <ul className="space-y-2">
                {selectedRoomStudents.map((student) => (
                  <li key={student.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{student.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">Nenhum aluno vinculado a esta sala</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}