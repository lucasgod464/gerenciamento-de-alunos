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
      const { data, error } = await supabase
        .from('students')
        .update({
          name: updatedStudent.name,
          birth_date: updatedStudent.birth_date,
          status: updatedStudent.status,
          email: updatedStudent.email,
          document: updatedStudent.document,
          address: updatedStudent.address,
          custom_fields: updatedStudent.custom_fields
        })
        .eq('id', updatedStudent.id)
        .select()
        .single();

      if (error) throw error;

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

      setLocalStudents(prev => 
        prev.map(student => 
          student.id === updatedStudent.id ? updatedStudent : student
        )
      );

      toast({
        title: "Sucesso",
        description: "Dados do aluno atualizados com sucesso!",
      });

      return data;
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar dados do aluno",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    localStudents,
    setLocalStudents,
    handleUpdateStudent
  };
};