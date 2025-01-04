import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Student, mapSupabaseStudentToStudent, SupabaseStudent } from "@/types/student";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { StudentColumns } from "@/components/admin/students/StudentColumns";

const StudentsTotal = () => {
  const { user: currentUser } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const { toast } = useToast();

  const loadStudents = async () => {
    try {
      console.log("Iniciando busca de alunos...");
      console.log("Company ID do usuário:", currentUser?.companyId);
      
      const { data: studentsData, error } = await supabase
        .from('students')
        .select(`
          *,
          room_students (
            room_id
          )
        `)
        .eq('company_id', currentUser?.companyId);

      if (error) {
        throw error;
      }

      console.log("Dados brutos dos alunos:", studentsData);

      const mappedStudents = studentsData.map(student => 
        mapSupabaseStudentToStudent(student as SupabaseStudent)
      );
      
      console.log("Alunos mapeados:", mappedStudents);
      setStudents(mappedStudents);
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
      toast({
        title: "Erro ao carregar alunos",
        description: "Não foi possível carregar a lista de alunos.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (currentUser?.companyId) {
      loadStudents();
    }
  }, [currentUser?.companyId]);

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
      // Primeiro, remove qualquer vínculo existente
      await supabase
        .from('room_students')
        .delete()
        .eq('student_id', studentId);

      // Depois, cria o novo vínculo
      const { error } = await supabase
        .from('room_students')
        .insert({ student_id: studentId, room_id: newRoomId });

      if (error) throw error;

      // Atualiza a lista local
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
          studentsWithoutRoom={students.filter(s => !s.room)}
          studentsWithRoom={students.filter(s => s.room)}
          rooms={[]} // Será preenchido com as salas disponíveis
          onDeleteStudent={handleDeleteStudent}
          onTransferStudent={handleTransferStudent}
        />
      </div>
    </DashboardLayout>
  );
};

export default StudentsTotal;