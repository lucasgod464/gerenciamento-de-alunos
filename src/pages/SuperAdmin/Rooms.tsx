import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, List } from "lucide-react";
import { Room } from "@/types/room";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function SuperAdminRooms() {
  const [searchTerm, setSearchTerm] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomStudents, setSelectedRoomStudents] = useState<any[]>([]);
  const [isStudentsDialogOpen, setIsStudentsDialogOpen] = useState(false);

  useEffect(() => {
    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    setRooms(allRooms);
  }, []);

  const handleViewStudents = (roomId: string) => {
    const allStudents = JSON.parse(localStorage.getItem("students") || "[]");
    const roomStudents = allStudents.filter((student: any) => student.room === roomId);
    setSelectedRoomStudents(roomStudents);
    setIsStudentsDialogOpen(true);
  };

  // Filter rooms based on search term
  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout role="super-admin">
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Salas</h1>
            <p className="text-muted-foreground">
              Visualize todas as salas do sistema
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar salas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Rooms Table */}
        <div className="border rounded-lg bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Sala</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.name}</TableCell>
                  <TableCell>{room.companyId || "Sem empresa"}</TableCell>
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
                  <TableCell>{room.studyRoom || "Não definido"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewStudents(room.id)}
                      title="Ver alunos"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Students Dialog */}
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
                      <List className="h-4 w-4 text-gray-500" />
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
      </div>
    </DashboardLayout>
  );
}