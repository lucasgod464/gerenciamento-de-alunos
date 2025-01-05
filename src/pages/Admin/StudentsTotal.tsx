import { DashboardLayout } from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import { Student } from "@/types/student";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StudentColumns } from "@/components/admin/students/StudentColumns";

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
      await supabase
        .from('room_students')
        .delete()
        .eq('student_id', studentId);

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

  const handleUpdateStudent = async (updatedStudent: Student) => {
    try {
      const { error: studentError } = await supabase
        .from('students')
        .update({
          name: updatedStudent.name,
          birth_date: updatedStudent.birthDate,
          status: updatedStudent.status,
          email: updatedStudent.email,
          document: updatedStudent.document,
          address: updatedStudent.address,
          custom_fields: updatedStudent.customFields
        })
        .eq('id', updatedStudent.id);

      if (studentError) throw studentError;

      if (updatedStudent.room) {
        await supabase
          .from('room_students')
          .delete()
          .eq('student_id', updatedStudent.id);

        const { error: roomError } = await supabase
          .from('room_students')
          .insert({
            student_id: updatedStudent.id,
            room_id: updatedStudent.room
          });

        if (roomError) throw roomError;
      }

      setStudents(prev => prev.map(student => 
        student.id === updatedStudent.id 
          ? updatedStudent
          : student
      ));

      toast({
        title: "Sucesso",
        description: "Aluno atualizado com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao atualizar aluno:', error);
      toast({
        title: "Erro ao atualizar aluno",
        description: "Não foi possível atualizar o aluno.",
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

        <StudentColumns
          studentsWithoutRoom={studentsWithoutRoom}
          studentsWithRoom={studentsWithRoom}
          rooms={rooms}
          onDeleteStudent={handleDeleteStudent}
          onTransferStudent={handleTransferStudent}
          onUpdateStudent={handleUpdateStudent}
        />
      </div>
    </DashboardLayout>
  );
};

export default StudentsTotal;