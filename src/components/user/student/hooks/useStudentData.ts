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
          room_id,
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
        // Mapear os dados dos alunos e incluir a sala associada
        const mappedStudents = roomStudents
          .filter(rs => rs.students) // Filtrar registros sem alunos
          .map(rs => ({
            id: rs.students.id,
            name: rs.students.name,
            birthDate: rs.students.birth_date,
            status: rs.students.status ?? true,
            email: rs.students.email || '',
            document: rs.students.document || '',
            address: rs.students.address || '',
            customFields: rs.students.custom_fields as Record<string, any> || {},
            companyId: rs.students.company_id,
            createdAt: rs.students.created_at,
            room: rs.room_id
          }));

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

  const loadRooms = async () => {
    try {
      if (!user?.id) return;
      
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