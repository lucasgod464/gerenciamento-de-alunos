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

      if (attendanceData.length === 0) {
        const students = await attendanceDataService.getCompanyStudents(currentUser.companyId);
        setDailyAttendances([{ date: dateStr, students }]);
      } else {
        const students = attendanceData.map(record => ({
          id: record.students.id,
          name: record.students.name,
          room: record.students.room_students?.[0]?.room_id || '',
          roomName: record.students.room_students?.[0]?.rooms?.name || '',
          status: record.status,
          companyId: currentUser.companyId
        }));

        setDailyAttendances([{ date: dateStr, students }]);
      }
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