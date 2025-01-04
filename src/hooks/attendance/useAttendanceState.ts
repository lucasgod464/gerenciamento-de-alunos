import { useState, useEffect } from "react";
import { DailyAttendance } from "@/services/attendance/types";
import { formatDate, normalizeDate } from "@/utils/dateUtils";
import { attendanceDataService } from "@/services/attendance/attendanceDataService";
import { useToast } from "@/hooks/use-toast";

export function useAttendanceState(selectedDate: Date | undefined, currentUser: any) {
  const [dailyAttendances, setDailyAttendances] = useState<DailyAttendance[]>([]);
  const [observation, setObservation] = useState("");
  const [attendanceDays, setAttendanceDays] = useState<Date[]>([]);
  const { toast } = useToast();

  const fetchAttendanceDays = async () => {
    if (!currentUser?.companyId) return;

    try {
      const days = await attendanceDataService.getAttendanceDays(currentUser.companyId);
      const normalizedDays = days.map(day => normalizeDate(new Date(day)));
      setAttendanceDays(normalizedDays);
    } catch (error) {
      console.error('Error fetching attendance days:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dias de presença",
        variant: "destructive",
      });
    }
  };

  const fetchDailyAttendance = async () => {
    if (!selectedDate || !currentUser?.companyId) return;

    const dateStr = formatDate(selectedDate);
    
    try {
      const attendanceData = await attendanceDataService.getDailyAttendance(dateStr, currentUser.companyId);
      setDailyAttendances([{ date: dateStr, students: attendanceData }]);

      // Buscar observações do dia
      const observationData = await attendanceDataService.getDailyObservation(dateStr, currentUser.companyId);
      setObservation(observationData?.text || "");
    } catch (error) {
      console.error('Error fetching daily attendance:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar presenças",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchAttendanceDays();
  }, [currentUser?.companyId]);

  useEffect(() => {
    if (selectedDate) {
      fetchDailyAttendance();
    }
  }, [selectedDate, currentUser?.companyId]);

  return {
    dailyAttendances,
    setDailyAttendances,
    observation,
    setObservation,
    attendanceDays,
    setAttendanceDays,
    fetchAttendanceDays,
    fetchDailyAttendance
  };
}