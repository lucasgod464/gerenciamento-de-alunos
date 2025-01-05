import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/utils/dateUtils";

interface Student {
  id: string;
  name: string;
  status?: string;
}

export const useAttendanceData = (date: Date, roomId: string) => {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase
        .from('room_students')
        .select(`
          student_id,
          students (
            id,
            name
          )
        `)
        .eq('room_id', roomId);

      if (error) {
        console.error('Erro ao buscar alunos:', error);
        return;
      }

      const formattedStudents = data.map(item => ({
        id: item.students.id,
        name: item.students.name
      }));

      // Buscar status de presença existente para a data
      const formattedDate = formatDate(date);
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('daily_attendance')
        .select('student_id, status')
        .eq('date', formattedDate)
        .eq('room_id', roomId);

      if (!attendanceError && attendanceData) {
        const attendanceMap = new Map(attendanceData.map(a => [a.student_id, a.status]));
        formattedStudents.forEach(student => {
          if (attendanceMap.has(student.id)) {
            student.status = attendanceMap.get(student.id);
          }
        });
      }

      setStudents(formattedStudents);
    };

    if (roomId) {
      fetchStudents();
    }
  }, [roomId, date]);

  return { students, setStudents };
};