import { useState, useEffect } from "react";
import { Student, DailyAttendance, AttendanceStatus } from "@/types/attendance";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import * as attendanceService from "@/services/attendanceService";

export function useAttendance() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dailyAttendances, setDailyAttendances] = useState<DailyAttendance[]>([]);
  const [observation, setObservation] = useState("");
  const [attendanceDays, setAttendanceDays] = useState<Date[]>([]);
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  const formatDateToString = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const areDatesEqual = (date1: Date, date2: Date): boolean => {
    return formatDateToString(date1) === formatDateToString(date2);
  };

  const fetchAttendanceData = async (date: Date) => {
    if (!currentUser?.companyId) return;

    const dateStr = formatDateToString(date);
    
    try {
      // Buscar presenças do dia
      const attendanceData = await attendanceService.fetchAttendanceData(dateStr, currentUser.companyId);
      setDailyAttendances(attendanceData);

      // Buscar observação do dia
      const observationData = await attendanceService.fetchDailyObservation(dateStr, currentUser.companyId);
      setObservation(observationData?.text || "");

      // Buscar todos os dias com chamada
      const daysData = await attendanceService.fetchAttendanceDays(currentUser.companyId);
      setAttendanceDays(daysData);

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
      await attendanceService.updateAttendanceStatus(studentId, dateStr, status, currentUser.companyId);
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
      await attendanceService.updateDailyObservation(dateStr, text, currentUser.companyId);
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
      await attendanceService.startNewAttendance(studentsData, dateStr, currentUser.companyId);
      
      setAttendanceDays(prev => [...prev, selectedDate]);
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
      await attendanceService.cancelDailyAttendance(dateStr, currentUser.companyId);
      
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

  useEffect(() => {
    if (selectedDate && currentUser?.companyId) {
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