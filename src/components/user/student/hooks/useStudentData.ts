import { useState } from "react";
import { Student } from "@/types/student";
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
      
      console.log("Dados dos alunos encontrados:", studentsData);

      if (studentsData) {
        const mappedStudents: Student[] = studentsData.map(student => ({
          id: student.id,
          name: student.name,
          birth_date: student.birth_date,
          status: student.status ?? true,
          email: student.email || '',
          document: student.document || '',
          address: student.address || '',
          custom_fields: student.custom_fields ? JSON.parse(JSON.stringify(student.custom_fields)) : {},
          company_id: student.company_id || '',
          created_at: student.created_at,
          room: student.room_students?.[0]?.room_id || null
        }));

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