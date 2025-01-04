import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Student } from "@/types/student";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AttendanceRow } from "./AttendanceRow";
import { useAuth } from "@/hooks/useAuth";

interface AttendanceListProps {
  selectedDate: Date;
  roomId: string;
}

export const AttendanceList = ({ selectedDate, roomId }: AttendanceListProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceData, setAttendanceData] = useState<Record<string, any>>({});
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchStudents = async () => {
    try {
      if (!roomId || !user?.company_id) return;

      console.log('Buscando dados para a data:', selectedDate.toISOString().split('T')[0]);

      // Primeiro, buscar os alunos da sala
      const { data: roomStudents, error: roomError } = await supabase
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
        .eq('room_id', roomId);

      if (roomError) throw roomError;

      if (roomStudents) {
        const validStudents = roomStudents
          .filter(rs => rs.student)
          .map(rs => rs.student as Student);
        
        setStudents(validStudents);

        // Agora, buscar os dados de presença para a data selecionada
        const { data: attendanceRecords, error: attendanceError } = await supabase
          .from('daily_attendance')
          .select('*')
          .eq('date', selectedDate.toISOString().split('T')[0])
          .eq('room_id', roomId);

        if (attendanceError) throw attendanceError;

        if (attendanceRecords) {
          const attendanceMap: Record<string, any> = {};
          attendanceRecords.forEach(record => {
            attendanceMap[record.student_id] = record;
          });
          setAttendanceData(attendanceMap);
        }
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Erro ao carregar alunos",
        description: "Ocorreu um erro ao carregar a lista de alunos.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [roomId, selectedDate]);

  const handleAttendanceChange = async (studentId: string, status: string) => {
    try {
      const existingRecord = attendanceData[studentId];
      
      if (existingRecord) {
        // Atualizar registro existente
        const { error: updateError } = await supabase
          .from('daily_attendance')
          .update({ status })
          .eq('id', existingRecord.id);

        if (updateError) throw updateError;
      } else {
        // Criar novo registro
        const { error: insertError } = await supabase
          .from('daily_attendance')
          .insert({
            date: selectedDate.toISOString().split('T')[0],
            student_id: studentId,
            status,
            room_id: roomId,
            company_id: user?.company_id
          });

        if (insertError) throw insertError;
      }

      // Atualizar dados locais
      setAttendanceData(prev => ({
        ...prev,
        [studentId]: {
          ...prev[studentId],
          status,
          student_id: studentId,
          date: selectedDate.toISOString().split('T')[0]
        }
      }));

      toast({
        title: "Presença registrada",
        description: "O registro de presença foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error('Error updating attendance:', error);
      toast({
        title: "Erro ao registrar presença",
        description: "Ocorreu um erro ao atualizar o registro de presença.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        {students.length > 0 ? (
          <div className="space-y-4">
            {students.map((student) => (
              <AttendanceRow
                key={student.id}
                student={student}
                attendance={attendanceData[student.id]}
                onAttendanceChange={handleAttendanceChange}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            Nenhum aluno encontrado para esta sala.
          </p>
        )}
      </CardContent>
    </Card>
  );
};