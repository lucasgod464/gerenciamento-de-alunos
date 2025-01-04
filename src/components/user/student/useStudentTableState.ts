import { useState, useEffect } from "react";
import { Student } from "@/types/student";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useStudentTableState = (initialStudents: Student[]) => {
  const [localStudents, setLocalStudents] = useState<Student[]>(initialStudents);
  const { toast } = useToast();

  useEffect(() => {
    setLocalStudents(initialStudents);
  }, [initialStudents]);

  useEffect(() => {
    const channel = supabase
      .channel('students_updates')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'students' 
        }, 
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setLocalStudents(prev => 
              prev.map(student => 
                student.id === payload.new.id 
                  ? { ...student, ...payload.new }
                  : student
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setLocalStudents(prev => 
              prev.filter(student => student.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleUpdateStudent = async (updatedStudent: Student) => {
    try {
      // Atualizar os dados básicos do aluno
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

      // Atualizar a relação com a sala
      if (updatedStudent.room) {
        // Primeiro, remover qualquer relação existente
        await supabase
          .from('room_students')
          .delete()
          .eq('student_id', updatedStudent.id);

        // Depois, criar a nova relação
        const { error: roomError } = await supabase
          .from('room_students')
          .insert({
            student_id: updatedStudent.id,
            room_id: updatedStudent.room
          });

        if (roomError) throw roomError;
      }

      return true;
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error);
      throw error;
    }
  };

  return {
    localStudents,
    setLocalStudents,
    handleUpdateStudent
  };
};