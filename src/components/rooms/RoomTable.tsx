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
import { Pencil, Trash2, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Room } from "@/types/room";
import { User } from "@/types/user";
import { Student } from "@/types/student";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  const [users, setUsers] = useState<User[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.companyId) return;
    
    // Carregar categorias
    const allCategories = JSON.parse(localStorage.getItem("categories") || "[]");
    const companyCategories = allCategories.filter(
      (cat: Category) => cat.companyId === user.companyId
    );
    setCategories(companyCategories);

    // Carregar usuários
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const createdEmails = JSON.parse(localStorage.getItem("createdEmails") || "[]");
    
    const companyUsers = allUsers.filter(
      (u: User) => u.companyId === user.companyId
    );
    
    const companyEmails = createdEmails.filter(
      (e: any) => e.company === user.companyId && e.accessLevel.toUpperCase() === "USER"
    ).map((e: any) => ({
      id: e.id,
      name: e.name,
      email: e.email,
      companyId: e.company,
      authorizedRooms: []
    }));
    
    const combinedUsers = [...companyUsers, ...companyEmails];
    setUsers(combinedUsers);

    // Carregar alunos
    const allStudents = JSON.parse(localStorage.getItem("students") || "[]");
    const companyStudents = allStudents.filter(
      (student: Student) => student.companyId === user.companyId
    );
    setStudents(companyStudents);
  }, [user]);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Sem categoria";
  };

  const getAuthorizedUsers = (room: Room) => {
    const authorizedUsers = users.filter(user => 
      user.authorizedRooms?.includes(room.id)
    );
    
    if (authorizedUsers.length === 0) {
      return "Nenhum usuário vinculado";
    }

    return authorizedUsers.map(user => user.name).join(", ");
  };

  const getRoomStudents = (roomId: string) => {
    return students.filter(student => student.room === roomId);
  };

  const handleShowStudents = (room: Room) => {
    setSelectedRoom(room);
    setIsDialogOpen(true);
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
            <TableHead>Alunos</TableHead>
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShowStudents(room)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Ver Alunos
                </Button>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Alunos da Sala: {selectedRoom?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedRoom && getRoomStudents(selectedRoom.id).length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getRoomStudents(selectedRoom.id).map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.email || "N/A"}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            student.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {student.status === "active" ? "Ativo" : "Inativo"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground">
                Nenhum aluno vinculado a esta sala
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}