import { useState } from "react";
import { Student, SupabaseStudent, mapSupabaseStudentToStudent } from "@/types/student";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useStudentData = (userId: string | undefined) => {
  const [students, setStudents] = useState<Student[]>([]);
  const { toast } = useToast();

  const loadStudents = async () => {
    if (!userId) return;
    
    try {
      console.log("Buscando alunos para o usuário:", userId);
      
      const { data: studentsData, error } = await supabase
        .from('students')
        .select(`
          *,
          room_students!left (
            room_id
          )
        `)
        .order('name');

      if (error) throw error;
      
      console.log("Dados brutos dos alunos:", studentsData);

      if (studentsData) {
        const mappedStudents: Student[] = studentsData.map(student => 
          mapSupabaseStudentToStudent(student as SupabaseStudent)
        );

        console.log("Alunos mapeados:", mappedStudents);
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

  return {
    students,
    loadStudents,
  };
};