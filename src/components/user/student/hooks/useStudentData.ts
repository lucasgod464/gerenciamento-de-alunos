import { useState, useEffect } from "react";
import { Student, mapSupabaseStudentToStudent } from "@/types/student";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export const useStudentData = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadStudents = async () => {
    if (!user?.companyId) return;

    try {
      const { data: studentsData, error } = await supabase
        .from('students')
        .select(`
          *,
          room_students (
            room_id
          )
        `)
        .eq('company_id', user.companyId);

      if (error) throw error;

      const mappedStudents = studentsData.map(mapSupabaseStudentToStudent);
      setStudents(mappedStudents);
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
    if (!user?.companyId) return;

    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('id, name')
        .eq('company_id', user.companyId)
        .eq('status', true);

      if (error) throw error;
      setRooms(data || []);
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