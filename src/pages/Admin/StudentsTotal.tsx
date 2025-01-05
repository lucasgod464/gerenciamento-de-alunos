import { DashboardLayout } from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import { Student } from "@/types/student";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { StudentTable } from "@/components/user/StudentTable";

const StudentsTotal = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
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
        .select('id, name')
        .eq('status', true);

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

  const studentsWithRoom = students.filter(student => student.room !== null);
  const studentsWithoutRoom = students.filter(student => student.room === null);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Total de Alunos</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie todos os alunos cadastrados
          </p>
        </div>

        <Tabs defaultValue="without-room" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="without-room">Alunos sem Sala</TabsTrigger>
            <TabsTrigger value="with-room">Alunos com Sala</TabsTrigger>
          </TabsList>
          
          <TabsContent value="without-room">
            <Card>
              <CardContent className="pt-6">
                <StudentTable 
                  students={studentsWithoutRoom}
                  rooms={rooms}
                  onDeleteStudent={handleDeleteStudent}
                  onTransferStudent={handleTransferStudent}
                  showTransferOption={true}
                />
                {studentsWithoutRoom.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    Nenhum aluno sem sala encontrado
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="with-room">
            <Card>
              <CardContent className="pt-6">
                <StudentTable 
                  students={studentsWithRoom}
                  rooms={rooms}
                  onDeleteStudent={handleDeleteStudent}
                  onTransferStudent={handleTransferStudent}
                  showTransferOption={true}
                />
                {studentsWithRoom.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    Nenhum aluno com sala encontrado
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentsTotal;