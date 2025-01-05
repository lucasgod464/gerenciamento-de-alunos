import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatDateForDatabase } from "@/utils/dateUtils";
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

  useEffect(() => {
    const loadObservations = async () => {
      try {
        const formattedDate = formatDateForDatabase(date);
        console.log('AttendanceList - Carregando observações para a data:', formattedDate);
        
        const { data, error } = await supabase
          .from('daily_observations')
          .select('student_id, text')
          .eq('date', formattedDate)
          .eq('company_id', companyId);

        if (error) throw error;

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
      const formattedDate = formatDateForDatabase(date);
      console.log('AttendanceList - Salvando status:', {
        data: formattedDate,
        studentId,
        status,
        companyId,
        roomId
      });

      // Primeiro deleta qualquer registro existente para esta data/aluno
      await supabase
        .from('daily_attendance')
        .delete()
        .eq('date', formattedDate)
        .eq('student_id', studentId)
        .eq('company_id', companyId)
        .eq('room_id', roomId);

      // Depois insere o novo registro
      const { error } = await supabase
        .from('daily_attendance')
        .insert({
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
      const formattedDate = formatDateForDatabase(date);
      console.log('AttendanceList - Salvando todas as presenças e observações:', {
        data: formattedDate,
        estudantes: students,
        observacoes: observations
      });
      
      // Primeiro, salvamos todas as presenças
      for (const student of students) {
        if (!student.status) continue;

        console.log('Salvando presença para estudante:', {
          studentId: student.id,
          status: student.status,
          data: formattedDate
        });

        // Deleta registro existente antes de inserir o novo
        await supabase
          .from('daily_attendance')
          .delete()
          .eq('date', formattedDate)
          .eq('student_id', student.id)
          .eq('company_id', companyId)
          .eq('room_id', roomId);

        const { error: attendanceError } = await supabase
          .from('daily_attendance')
          .insert({
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
        if (!text.trim()) continue;
        
        console.log('Salvando observação para estudante:', {
          studentId,
          text,
          data: formattedDate
        });

        // Deleta observação existente antes de inserir a nova
        await supabase
          .from('daily_observations')
          .delete()
          .eq('date', formattedDate)
          .eq('student_id', studentId)
          .eq('company_id', companyId);

        const { error: observationError } = await supabase
          .from('daily_observations')
          .insert({
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
