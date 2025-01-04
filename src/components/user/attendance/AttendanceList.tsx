import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/utils/dateUtils";
import { AttendanceHeader } from "./AttendanceHeader";
import { AttendanceRow } from "./AttendanceRow";

interface Student {
  id: string;
  name: string;
  status?: string;
}

interface AttendanceListProps {
  date: Date;
  roomId: string;
  companyId: string;
  onAttendanceSaved: () => void;
}

export const AttendanceList = ({ date, roomId, companyId, onAttendanceSaved }: AttendanceListProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [observations, setObservations] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase
        .from('room_students')
        .select(`
          student:students (
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
        name: item.students.name,
        status: 'present'
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

    // Inscrever-se para atualizações em tempo real
    const channel = supabase
      .channel('attendance-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'daily_attendance',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          console.log('Mudança detectada:', payload);
          if (payload.new) {
            setStudents(currentStudents => 
              currentStudents.map(student => 
                student.id === payload.new.student_id 
                  ? { ...student, status: payload.new.status }
                  : student
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, date]);

  const handleStatusChange = async (studentId: string, status: string) => {
    try {
      const formattedDate = formatDate(date);
      
      const { error } = await supabase
        .from('daily_attendance')
        .upsert({
          date: formattedDate,
          student_id: studentId,
          status: status,
          company_id: companyId,
          room_id: roomId
        });

      if (error) throw error;
      
      setStudents(prev =>
        prev.map(student =>
          student.id === studentId ? { ...student, status } : student
        )
      );
    } catch (error) {
      console.error('Erro ao salvar presença:', error);
      toast({
        title: "Erro ao salvar presença",
        description: "Não foi possível salvar o status de presença.",
        variant: "destructive",
      });
    }
  };

  const handleObservationChange = (studentId: string, text: string) => {
    setObservations(prev => ({
      ...prev,
      [studentId]: text
    }));
  };

  const handleSave = async () => {
    try {
      const formattedDate = formatDate(date);
      
      const attendancePromises = students.map(student => 
        supabase
          .from('daily_attendance')
          .upsert({
            date: formattedDate,
            student_id: student.id,
            status: student.status,
            company_id: companyId,
            room_id: roomId
          })
      );

      await Promise.all(attendancePromises);
      
      const observationEntries = Object.entries(observations);
      if (observationEntries.length > 0) {
        const { error: obsError } = await supabase
          .from('daily_observations')
          .upsert(
            observationEntries.map(([studentId, text]) => ({
              date: formattedDate,
              text,
              company_id: companyId,
              student_id: studentId
            }))
          );

        if (obsError) throw obsError;
      }

      onAttendanceSaved();
      
      toast({
        title: "Presença registrada",
        description: "Os dados foram salvos com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar os dados de presença.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <AttendanceHeader onSave={handleSave} />
        <div className="space-y-2">
          {students.map((student) => (
            <AttendanceRow
              key={student.id}
              student={student}
              observation={observations[student.id] || ''}
              onStatusChange={handleStatusChange}
              onObservationChange={handleObservationChange}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
