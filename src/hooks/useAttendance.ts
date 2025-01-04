import { useState, useEffect } from "react";
import { Student, DailyAttendance, DailyObservation, AttendanceStatus } from "@/types/attendance";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useAttendance() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dailyAttendances, setDailyAttendances] = useState<DailyAttendance[]>([]);
  const [observation, setObservation] = useState("");
  const [attendanceDays, setAttendanceDays] = useState<Date[]>([]);
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  // Função para normalizar a data (remover horário)
  const normalizeDate = (date: Date): Date => {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
  };

  // Função para converter data para string no formato ISO
  const formatDateToString = (date: Date): string => {
    const normalized = normalizeDate(date);
    return normalized.toISOString().split('T')[0];
  };

  // Função para verificar se duas datas são iguais (ignorando horário)
  const areDatesEqual = (date1: Date, date2: Date): boolean => {
    return formatDateToString(date1) === formatDateToString(date2);
  };

  const fetchAttendanceData = async (date: Date) => {
    if (!currentUser?.companyId) return;

    const dateStr = formatDateToString(date);
    
    try {
      // Buscar presenças do dia
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('daily_attendance')
        .select(`
          *,
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
        .eq('date', dateStr)
        .eq('company_id', currentUser.companyId);

      if (attendanceError) throw attendanceError;

      // Buscar observação do dia
      const { data: observationData, error: observationError } = await supabase
        .from('daily_observations')
        .select('*')
        .eq('date', dateStr)
        .eq('company_id', currentUser.companyId)
        .maybeSingle();

      if (observationError && observationError.code !== 'PGRST116') {
        throw observationError;
      }

      // Buscar todos os dias com chamada
      const { data: daysData, error: daysError } = await supabase
        .from('daily_attendance')
        .select('date')
        .eq('company_id', currentUser.companyId)
        .distinct();

      if (daysError) throw daysError;

      // Atualizar estados
      if (attendanceData) {
        setDailyAttendances(attendanceData as DailyAttendance[]);
      }

      if (observationData) {
        setObservation(observationData.text);
      } else {
        setObservation("");
      }

      if (daysData) {
        const formattedDays = [...new Set(daysData.map(day => new Date(day.date)))];
        setAttendanceDays(formattedDays.map(normalizeDate));
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
    if (!currentUser?.companyId) return;
    
    const dateStr = formatDateToString(selectedDate);

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
    if (!currentUser?.companyId) return;
    
    const dateStr = formatDateToString(selectedDate);

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
    if (!currentUser?.companyId) return;

    try {
      const { data: studentsData, error } = await supabase
        .from('students')
        .select('*')
        .eq('company_id', currentUser.companyId);

      if (error) throw error;

      const dateStr = formatDateToString(selectedDate);
      const attendanceRecords = studentsData.map(student => ({
        student_id: student.id,
        date: dateStr,
        status: 'present' as AttendanceStatus,
        company_id: currentUser.companyId
      }));

      const { error: insertError } = await supabase
        .from('daily_attendance')
        .upsert(attendanceRecords);

      if (insertError) throw insertError;
      
      // Atualiza a lista de dias com chamada
      setAttendanceDays(prev => [...prev, normalizeDate(selectedDate)]);
      
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
    if (!currentUser?.companyId) return;

    try {
      const dateStr = formatDateToString(selectedDate);
      
      // Remove presenças do dia
      const { error: attendanceError } = await supabase
        .from('daily_attendance')
        .delete()
        .eq('date', dateStr)
        .eq('company_id', currentUser.companyId);

      if (attendanceError) throw attendanceError;

      // Remove observação do dia
      const { error: observationError } = await supabase
        .from('daily_observations')
        .delete()
        .eq('date', dateStr)
        .eq('company_id', currentUser.companyId);

      if (observationError) throw observationError;
      
      // Atualiza a lista de dias com chamada
      setAttendanceDays(prev => prev.filter(date => !areDatesEqual(date, selectedDate)));
      
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

  // Atualiza os dados quando a data selecionada muda
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
    attendanceDays,
    handleStatusChange,
    handleObservationChange,
    startAttendance,
    cancelAttendance,
  };
}