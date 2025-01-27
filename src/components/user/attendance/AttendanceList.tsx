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

  useEffect(() => {
    const loadObservations = async () => {
      try {
        const formattedDate = formatDate(date);
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
      setStudents(prev =>
        prev.map(student =>
          student.id === studentId ? { ...student, status } : student
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status de presença.",
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
      
      // Primeiro, remover registros existentes para evitar duplicação
      const { error: deleteAttendanceError } = await supabase
        .from('daily_attendance')
        .delete()
        .eq('date', formattedDate)
        .eq('room_id', roomId);

      if (deleteAttendanceError) throw deleteAttendanceError;

      // Preparar todas as presenças para inserção
      const attendanceBatch = students
        .filter(student => student.status)
        .map(student => ({
          date: formattedDate,
          student_id: student.id,
          status: student.status,
          company_id: companyId,
          room_id: roomId
        }));

      // Inserir presenças em uma única operação
      if (attendanceBatch.length > 0) {
        const { error: attendanceError } = await supabase
          .from('daily_attendance')
          .insert(attendanceBatch);

        if (attendanceError) throw attendanceError;
      }

      // Remover observações existentes
      const { error: deleteObservationsError } = await supabase
        .from('daily_observations')
        .delete()
        .eq('date', formattedDate)
        .eq('company_id', companyId);

      if (deleteObservationsError) throw deleteObservationsError;

      // Preparar observações para inserção
      const observationBatch = Object.entries(observations)
        .filter(([_, text]) => text.trim())
        .map(([studentId, text]) => ({
          date: formattedDate,
          text,
          company_id: companyId,
          student_id: studentId
        }));

      // Inserir observações em uma única operação
      if (observationBatch.length > 0) {
        const { error: observationError } = await supabase
          .from('daily_observations')
          .insert(observationBatch);

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