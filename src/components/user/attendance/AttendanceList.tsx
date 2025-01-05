import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/utils/dateUtils";
import { AttendanceHeader } from "./AttendanceHeader";
import { AttendanceRow } from "./AttendanceRow";
import { useAttendanceData } from "./hooks/useAttendanceData";

interface AttendanceListProps {
  date: Date;
  roomId: string;
  companyId: string;
  onAttendanceSaved: () => void;
}

export const AttendanceList = ({ date, roomId, companyId, onAttendanceSaved }: AttendanceListProps) => {
  const { students, setStudents } = useAttendanceData(date, roomId);
  const [observations, setObservations] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Carregar observações existentes quando a data ou sala mudar
  useEffect(() => {
    const loadObservations = async () => {
      try {
        const formattedDate = formatDate(date);
        console.log('AttendanceList - Data recebida:', date);
        console.log('AttendanceList - Data formatada:', formattedDate);
        
        const { data, error } = await supabase
          .from('daily_observations')
          .select('student_id, text')
          .eq('date', formattedDate)
          .eq('company_id', companyId);

        if (error) throw error;

        console.log('AttendanceList - Observações carregadas:', data);

        const observationsMap = (data || []).reduce((acc, curr) => {
          acc[curr.student_id] = curr.text;
          return acc;
        }, {} as Record<string, string>);

        setObservations(observationsMap);
      } catch (error) {
        console.error('Erro ao carregar observações:', error);
      }
    };

    loadObservations();
  }, [date, roomId, companyId]);

  const handleStatusChange = async (studentId: string, status: string) => {
    try {
      const formattedDate = formatDate(date);
      console.log('AttendanceList - Salvando status:', {
        data: formattedDate,
        studentId,
        status
      });
      
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
      console.log('AttendanceList - Salvando todas as presenças e observações:', {
        data: formattedDate,
        estudantes: students,
        observacoes: observations
      });
      
      // Primeiro, salvamos todas as presenças
      for (const student of students) {
        if (!student.status) continue;

        const { error: attendanceError } = await supabase
          .from('daily_attendance')
          .upsert({
            date: formattedDate,
            student_id: student.id,
            status: student.status,
            company_id: companyId,
            room_id: roomId
          });
          
        if (attendanceError) throw attendanceError;
      }
      
      // Depois, salvamos as observações
      for (const [studentId, text] of Object.entries(observations)) {
        if (!text.trim()) continue; // Pula observações vazias
        
        const { error: observationError } = await supabase
          .from('daily_observations')
          .upsert({
            date: formattedDate,
            text,
            company_id: companyId,
            student_id: studentId
          });
          
        if (observationError) throw observationError;
      }

      onAttendanceSaved();
      
      toast({
        title: "Dados salvos",
        description: "Presenças e observações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar os dados. Por favor, tente novamente.",
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