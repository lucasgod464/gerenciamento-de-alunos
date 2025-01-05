import { useState, useEffect } from "react";
import { Student } from "@/types/student";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useUserRooms } from "@/hooks/useUserRooms";

export const useStudentData = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  const { rooms: authorizedRooms } = useUserRooms();

  const loadStudents = async () => {
    try {
      if (!user?.id) return;

      // Primeiro, obter os IDs das salas autorizadas
      const authorizedRoomIds = authorizedRooms.map(room => room.id);

      if (authorizedRoomIds.length === 0) {
        setStudents([]);
        return;
      }

      // Buscar alunos vinculados às salas autorizadas
      const { data: roomStudents, error: roomStudentsError } = await supabase
        .from('room_students')
        .select(`
          student_id,
          students (
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
          )
        `)
        .in('room_id', authorizedRoomIds);

      if (roomStudentsError) throw roomStudentsError;

      if (roomStudents) {
        // Remover duplicatas e mapear para o formato correto
        const uniqueStudents = Array.from(new Set(roomStudents.map(rs => rs.students?.id)))
          .map(studentId => {
            const studentData = roomStudents.find(rs => rs.students?.id === studentId)?.students;
            if (!studentData) return null;

            return {
              id: studentData.id,
              name: studentData.name,
              birthDate: studentData.birth_date,
              status: studentData.status ?? true,
              email: studentData.email || '',
              document: studentData.document || '',
              address: studentData.address || '',
              customFields: studentData.custom_fields as Record<string, any> || {},
              companyId: studentData.company_id,
              createdAt: studentData.created_at,
              room: null // Será atualizado abaixo
            };
          })
          .filter((student): student is Student => student !== null);

        setStudents(uniqueStudents);
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

  const loadRooms = async () => {
    if (!user?.id) return;
    
    try {
      const mappedRooms = authorizedRooms.map(room => ({
        id: room.id,
        name: room.name
      }));
      
      setRooms(mappedRooms);
    } catch (error) {
      console.error('Erro ao carregar salas:', error);
      toast({
        title: "Erro ao carregar salas",
        description: "Não foi possível carregar a lista de salas.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadStudents();
      loadRooms();
    }
  }, [user?.id, authorizedRooms]);

  return {
    students,
    rooms,
    loadStudents,
    loadRooms
  };
};