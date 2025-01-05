import { useState, useEffect } from "react";
import { Student } from "@/types/student";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export const useStudentData = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadStudents = async () => {
    if (!user?.id) return;

    try {
      // Primeiro, buscar as salas autorizadas do usuário
      const { data: userRooms, error: roomsError } = await supabase
        .from('user_rooms')
        .select('room_id')
        .eq('user_id', user.id);

      if (roomsError) throw roomsError;

      if (!userRooms?.length) {
        setStudents([]);
        return;
      }

      const roomIds = userRooms.map(ur => ur.room_id);

      // Depois, buscar os alunos vinculados a essas salas
      const { data: studentsData, error } = await supabase
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
          )
        `)
        .in('room_id', roomIds);

      if (error) throw error;

      if (!studentsData) {
        setStudents([]);
        return;
      }

      const uniqueStudents = Array.from(
        new Map(
          studentsData
            .filter(rs => rs.student)
            .map(rs => [rs.student.id, {
              id: rs.student.id,
              name: rs.student.name,
              birthDate: rs.student.birth_date,
              status: rs.student.status ?? true,
              email: rs.student.email || null,
              document: rs.student.document || null,
              address: rs.student.address || null,
              customFields: rs.student.custom_fields as Record<string, any> || {},
              companyId: rs.student.company_id,
              createdAt: rs.student.created_at,
              room: null // Será preenchido depois
            }])
        ).values()
      );

      setStudents(uniqueStudents);
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
      const { data, error } = await supabase
        .from('user_rooms')
        .select(`
          rooms (
            id,
            name
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const formattedRooms = data
        ?.map(item => item.rooms)
        .filter(room => room !== null)
        .map(room => ({
          id: room.id,
          name: room.name
        })) || [];

      setRooms(formattedRooms);
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
  }, [user?.id]);

  return {
    students,
    rooms,
    loadStudents,
    loadRooms
  };
};