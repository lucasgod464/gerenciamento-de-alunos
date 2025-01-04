import { useAuth } from "@/hooks/useAuth";
import { Student } from "@/types/student";
import { useStudentData } from "./hooks/useStudentData";
import { useRoomData } from "./hooks/useRoomData";
import { useStudentFilters } from "./hooks/useStudentFilters";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useStudentManagement = () => {
  const { user } = useAuth();
  const { students, loadStudents } = useStudentData(user?.id);
  const { rooms, loadRooms } = useRoomData(user?.id);
  const { searchTerm, setSearchTerm, selectedRoom, setSelectedRoom, filteredStudents } = useStudentFilters(students);
  const { toast } = useToast();

  const handleAddStudent = async (newStudent: Student) => {
    try {
      // Primeiro, insere o estudante
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .insert({
          name: newStudent.name,
          birth_date: newStudent.birthDate,
          status: newStudent.status,
          email: newStudent.email,
          document: newStudent.document,
          address: newStudent.address,
          custom_fields: newStudent.customFields,
          company_id: user?.companyId
        })
        .select()
        .single();

      if (studentError) {
        console.error('Erro ao inserir estudante:', studentError);
        throw studentError;
      }

      // Se um room foi selecionado, cria a relação room_students
      if (newStudent.room && studentData) {
        const { error: roomError } = await supabase
          .from('room_students')
          .insert({
            student_id: studentData.id,
            room_id: newStudent.room
          });

        if (roomError) {
          console.error('Erro ao vincular estudante à sala:', roomError);
          throw roomError;
        }
      }

      toast({
        title: "Sucesso",
        description: "Aluno cadastrado com sucesso!",
      });

      await loadStudents();
    } catch (error: any) {
      console.error('Erro ao adicionar aluno:', error);
      toast({
        title: "Erro ao cadastrar aluno",
        description: error.message || "Não foi possível cadastrar o aluno.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadStudents();
      toast({
        title: "Sucesso",
        description: "Aluno excluído com sucesso!",
      });
    } catch (error: any) {
      console.error('Erro ao excluir aluno:', error);
      toast({
        title: "Erro ao excluir aluno",
        description: error.message || "Não foi possível excluir o aluno.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStudent = async (updatedStudent: Student) => {
    try {
      // Atualiza os dados do estudante
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

      // Atualiza a relação com a sala
      if (updatedStudent.room) {
        // Remove relações antigas
        await supabase
          .from('room_students')
          .delete()
          .eq('student_id', updatedStudent.id);

        // Adiciona nova relação
        const { error: roomError } = await supabase
          .from('room_students')
          .insert({
            student_id: updatedStudent.id,
            room_id: updatedStudent.room
          });

        if (roomError) throw roomError;
      }

      toast({
        title: "Sucesso",
        description: "Aluno atualizado com sucesso!",
      });

      await loadStudents();
    } catch (error: any) {
      console.error('Erro ao atualizar aluno:', error);
      toast({
        title: "Erro ao atualizar aluno",
        description: error.message || "Não foi possível atualizar o aluno.",
        variant: "destructive",
      });
    }
  };

  return {
    students: filteredStudents,
    rooms,
    searchTerm,
    setSearchTerm,
    selectedRoom,
    setSelectedRoom,
    handleAddStudent,
    handleDeleteStudent,
    handleUpdateStudent,
    loadStudents,
  };
};