import { useState, useEffect } from "react";
import { Student, DailyAttendance, DailyObservation, AttendanceStatus } from "@/types/attendance";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export function useAttendance() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dailyAttendances, setDailyAttendances] = useState<DailyAttendance[]>([]);
  const [observation, setObservation] = useState("");
  const [observations, setObservations] = useState<DailyObservation[]>([]);
  const [attendanceDays, setAttendanceDays] = useState<Date[]>([]);
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  const fetchAttendanceData = async (date: Date) => {
    if (!currentUser?.companyId) return;

    const dateStr = date.toISOString().split('T')[0];
    
    try {
      // Buscar presenças do dia
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('daily_attendance')
        .select('*, students(*)')
        .eq('date', dateStr)
        .eq('company_id', currentUser.companyId);

      if (attendanceError) throw attendanceError;

      // Buscar observações do dia
      const { data: observationData, error: observationError } = await supabase
        .from('daily_observations')
        .select('*')
        .eq('date', dateStr)
        .eq('company_id', currentUser.companyId)
        .maybeSingle();

      if (observationError && observationError.code !== 'PGRST116') {
        throw observationError;
      }

      // Buscar dias com presença marcada
      const { data: daysData, error: daysError } = await supabase
        .from('daily_attendance')
        .select('date')
        .eq('company_id', currentUser.companyId)
        .distinct();

      if (daysError) throw daysError;

      // Atualizar estados
      if (attendanceData) {
        const formattedAttendance: DailyAttendance[] = attendanceData.map(record => ({
          id: record.id,
          date: record.date,
          student_id: record.student_id,
          status: record.status as AttendanceStatus,
          company_id: record.company_id,
          created_at: record.created_at,
          room_id: record.room_id,
          students: record.students
        }));
        setDailyAttendances(formattedAttendance);
      }

      if (observationData) {
        setObservation(observationData.text);
        setObservations([{ 
          id: observationData.id,
          date: dateStr, 
          text: observationData.text,
          company_id: observationData.company_id,
          created_at: observationData.created_at
        }]);
      } else {
        setObservation("");
      }

      if (daysData) {
        setAttendanceDays(daysData.map(day => new Date(day.date)));
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados de presença.",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (studentId: string, status: AttendanceStatus) => {
    if (!selectedDate || !currentUser?.companyId) return;
    
    const dateStr = selectedDate.toISOString().split('T')[0];

    try {
      const { error } = await supabase
        .from('daily_attendance')
        .upsert({
          student_id: studentId,
          date: dateStr,
          status,
          company_id: currentUser.companyId
        });

      if (error) throw error;

      await fetchAttendanceData(selectedDate);

      toast({
        title: "Status atualizado",
        description: "O status de presença foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error('Error updating attendance:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status de presença.",
        variant: "destructive",
      });
    }
  };

  const handleObservationChange = async (text: string) => {
    if (!selectedDate || !currentUser?.companyId) return;
    
    const dateStr = selectedDate.toISOString().split('T')[0];

    try {
      const { error } = await supabase
        .from('daily_observations')
        .upsert({
          date: dateStr,
          text,
          company_id: currentUser.companyId
        });

      if (error) throw error;

      setObservation(text);
      setObservations(prev => {
        const filtered = prev.filter(obs => obs.date !== dateStr);
        return [...filtered, { 
          id: '', // será atualizado no próximo fetch
          date: dateStr, 
          text,
          company_id: currentUser.companyId || null,
          created_at: new Date().toISOString()
        }];
      });
    } catch (error) {
      console.error('Error updating observation:', error);
      toast({
        title: "Erro ao salvar observação",
        description: "Não foi possível salvar a observação.",
        variant: "destructive",
      });
    }
  };

  const startAttendance = async () => {
    if (!selectedDate || !currentUser?.companyId) return;

    try {
      // Iniciar presença para todos os alunos da empresa
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .eq('company_id', currentUser.companyId);

      if (studentsError) throw studentsError;

      const dateStr = selectedDate.toISOString().split('T')[0];
      const attendanceRecords = studentsData.map(student => ({
        student_id: student.id,
        date: dateStr,
        status: 'present' as AttendanceStatus,
        company_id: currentUser.companyId
      }));

      const { error } = await supabase
        .from('daily_attendance')
        .upsert(attendanceRecords);

      if (error) throw error;

      await fetchAttendanceData(selectedDate);

      toast({
        title: "Chamada iniciada",
        description: "A chamada foi iniciada para o dia selecionado.",
      });
    } catch (error) {
      console.error('Error starting attendance:', error);
      toast({
        title: "Erro ao iniciar chamada",
        description: "Não foi possível iniciar a chamada.",
        variant: "destructive",
      });
    }
  };

  const cancelAttendance = async () => {
    if (!selectedDate || !currentUser?.companyId) return;

    try {
      const dateStr = selectedDate.toISOString().split('T')[0];

      // Remover presenças do dia
      const { error: attendanceError } = await supabase
        .from('daily_attendance')
        .delete()
        .eq('date', dateStr)
        .eq('company_id', currentUser.companyId);

      if (attendanceError) throw attendanceError;

      // Remover observações do dia
      const { error: observationError } = await supabase
        .from('daily_observations')
        .delete()
        .eq('date', dateStr)
        .eq('company_id', currentUser.companyId);

      if (observationError) throw observationError;

      await fetchAttendanceData(selectedDate);

      toast({
        title: "Chamada cancelada",
        description: "A chamada foi cancelada para o dia selecionado.",
      });
    } catch (error) {
      console.error('Error canceling attendance:', error);
      toast({
        title: "Erro ao cancelar chamada",
        description: "Não foi possível cancelar a chamada.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchAttendanceData(selectedDate);
    }
  }, [selectedDate, currentUser?.companyId]);

  return {
    selectedDate,
    setSelectedDate,
    dailyAttendances,
    observation,
    observations,
    attendanceDays,
    handleStatusChange,
    handleObservationChange,
    startAttendance,
    cancelAttendance,
  };
}