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
      
      // Primeiro, buscar as salas do usuário
      const { data: userRooms, error: roomsError } = await supabase
        .from('user_rooms')
        .select('room_id')
        .eq('user_id', userId);

      if (roomsError) throw roomsError;
      
      console.log("Salas do usuário:", userRooms);

      if (!userRooms?.length) {
        console.log("Usuário não tem salas associadas");
        return;
      }

      const roomIds = userRooms.map(ur => ur.room_id);

      // Buscar alunos das salas do usuário usando LEFT JOIN para pegar todos os dados
      const { data: studentsData, error: studentsError } = await supabase
        .from('room_students')
        .select(`
          student:students (
            id,
            name,
            birth_date,
            status,
            email,
            document,
            address,
            custom_fields,
            company_id,
            created_at
          ),
          room_id
        `)
        .in('room_id', roomIds);

      if (studentsError) throw studentsError;
      
      console.log("Dados dos alunos encontrados:", studentsData);

      if (studentsData) {
        const mappedStudents = studentsData
          .map(rs => rs.student)
          .filter((student): student is Student => student !== null)
          .map(student => ({
            ...student,
            custom_fields: student.custom_fields as Record<string, any>,
            room: studentsData.find(rs => rs.student?.id === student.id)?.room_id
          }));

        console.log("Alunos mapeados:", mappedStudents);
        setStudents(mappedStudents);
      }
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
      toast({
        title: "Erro ao carregar alunos",
        description: "Não foi possível carregar a lista de alunos.",
        variant: "destructive",
      });
    }
  };

  return {
    students,
    loadStudents,
  };
};