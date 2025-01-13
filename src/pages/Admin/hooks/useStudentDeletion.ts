import { supabase } from "@/integrations/supabase/client";

export const useStudentDeletion = () => {
  const deleteStudent = async (studentId: string) => {
    try {
      // 1. Primeiro, remover registros de presença
      await supabase
        .from('daily_attendance')
        .delete()
        .eq('student_id', studentId);

      // 2. Remover as relações na tabela room_students
      await supabase
        .from('room_students')
        .delete()
        .eq('student_id', studentId);

      // 3. Remover as observações diárias
      await supabase
        .from('daily_observations')
        .delete()
        .eq('student_id', studentId);

      // 4. Finalmente, remover o aluno
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao deletar aluno:', error);
      throw error;
    }
  };

  return { deleteStudent };
};
