import { useState, useEffect } from "react";
import { Student, DailyAttendance, DailyObservation, AttendanceStatus } from "@/types/attendance";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchDailyAttendance,
  fetchDailyObservation,
  fetchAttendanceDays,
  updateAttendanceStatus,
  updateDailyObservation,
  startNewAttendance,
  cancelDailyAttendance
} from "@/services/attendanceService";

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
      const [attendanceData, observationData, daysData] = await Promise.all([
        fetchDailyAttendance(dateStr, currentUser.companyId),
        fetchDailyObservation(dateStr, currentUser.companyId),
        fetchAttendanceDays(currentUser.companyId)
      ]);

      if (attendanceData) {
        setDailyAttendances(attendanceData);
      }

      if (observationData) {
        setObservation(observationData.text);
        setObservations([observationData]);
      } else {
        setObservation("");
      }

      if (daysData) {
        setAttendanceDays(daysData.map(day => new Date(day)));
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
      await updateAttendanceStatus(studentId, dateStr, status, currentUser.companyId);
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
      await updateDailyObservation(dateStr, text, currentUser.companyId);
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
    if (!selectedDate || !currentUser?.companyId) return;

    try {
      const { data: studentsData, error } = await supabase
        .from('students')
        .select('*')
        .eq('company_id', currentUser.companyId);

      if (error) throw error;

      const dateStr = selectedDate.toISOString().split('T')[0];
      await startNewAttendance(studentsData, dateStr, currentUser.companyId);
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
      await cancelDailyAttendance(dateStr, currentUser.companyId);
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