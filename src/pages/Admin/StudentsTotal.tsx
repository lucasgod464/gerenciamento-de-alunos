import { DashboardLayout } from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import { Student } from "@/types/student";
import { Room } from "@/types/room";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const StudentsTotal = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const { toast } = useToast();

  const loadStudents = async () => {
    try {
      const { data: studentsData, error } = await supabase
        .from('students')
        .select(`
          *,
          room_students (
            room_id
          )
        `)
        .order('name');

      if (error) throw error;

      if (studentsData) {
        const mappedStudents = studentsData.map(student => ({
          id: student.id,
          name: student.name,
          birthDate: student.birth_date,
          status: student.status,
          email: student.email || '',
          document: student.document || '',
          address: student.address || '',
          customFields: student.custom_fields || {},
          companyId: student.company_id,
          createdAt: student.created_at,
          room: student.room_students?.[0]?.room_id || null
        }));
        setStudents(mappedStudents);
      }
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
      toast({
        title: "Erro ao carregar alunos",
        description: "Ocorreu um erro ao carregar a lista de alunos.",
        variant: "destructive",
      });
    }
  };

  const loadRooms = async () => {
    try {
      const { data: roomsData, error } = await supabase
        .from('rooms')
        .select('*')
        .order('name');

      if (error) throw error;
      if (roomsData) setRooms(roomsData);
    } catch (error) {
      console.error('Erro ao carregar salas:', error);
      toast({
        title: "Erro ao carregar salas",
        description: "Ocorreu um erro ao carregar as salas.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadStudents();
    loadRooms();
  }, []);

  const handleDeleteStudent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setStudents(prev => prev.filter(student => student.id !== id));
      toast({
        title: "Sucesso",
        description: "Aluno excluído com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao excluir aluno:', error);
      toast({
        title: "Erro ao excluir aluno",
        description: "Não foi possível excluir o aluno.",
        variant: "destructive",
      });
    }
  };

  const handleTransferStudent = async (studentId: string, newRoomId: string) => {
    try {
      // Primeiro remove qualquer vínculo existente
      await supabase
        .from('room_students')
        .delete()
        .eq('student_id', studentId);

      // Depois cria o novo vínculo
      const { error } = await supabase
        .from('room_students')
        .insert({ student_id: studentId, room_id: newRoomId });

      if (error) throw error;

      setStudents(prev => prev.map(student => 
        student.id === studentId 
          ? { ...student, room: newRoomId }
          : student
      ));

      toast({
        title: "Sucesso",
        description: "Aluno transferido com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao transferir aluno:', error);
      toast({
        title: "Erro ao transferir aluno",
        description: "Não foi possível transferir o aluno para a nova sala.",
        variant: "destructive",
      });
    }
  };

  const getRoomName = (roomId: string | null) => {
    if (!roomId) return "Sem sala";
    const room = rooms.find(r => r.id === roomId);
    return room ? room.name : "Sem sala";
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Total de Alunos</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie todos os alunos cadastrados
          </p>
        </div>

        <Card className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Data de Nascimento</TableHead>
                <TableHead>Sala Atual</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    {new Date(student.birthDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={student.room || ""}
                      onValueChange={(newRoomId) => handleTransferStudent(student.id, newRoomId)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={getRoomName(student.room)} />
                      </SelectTrigger>
                      <SelectContent>
                        {rooms.map((room) => (
                          <SelectItem key={room.id} value={room.id}>
                            {room.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        student.status
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {student.status ? "Ativo" : "Inativo"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir Aluno</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteStudent(student.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentsTotal;