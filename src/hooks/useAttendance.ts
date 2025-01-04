import { useState, useEffect } from "react";
import { AttendanceStudent, DailyAttendance } from "@/services/attendance/types";
import { attendanceDataService } from "@/services/attendance/attendanceDataService";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { formatDate, areDatesEqual, normalizeDate } from "@/utils/dateUtils";

export function useAttendance(selectedDate: Date | undefined) {
  const [dailyAttendances, setDailyAttendances] = useState<DailyAttendance[]>([]);
  const [observation, setObservation] = useState("");
  const [attendanceDays, setAttendanceDays] = useState<Date[]>([]);
  const { user: currentUser } = useAuth();
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
          status: record.status as AttendanceStudent["status"],
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
  }, [currentUser]);

  useEffect(() => {
    if (selectedDate) {
      fetchDailyAttendance();
    }
  }, [selectedDate]);

  const handleStatusChange = async (studentId: string, status: AttendanceStudent["status"]) => {
    if (!selectedDate || !currentUser?.companyId) return;
    
    const dateStr = formatDate(selectedDate);

    try {
      await attendanceDataService.saveAttendance({
        date: dateStr,
        studentId,
        status,
        companyId: currentUser.companyId
      });

      // Atualiza o estado localmente em vez de buscar novamente
      setDailyAttendances(prev => {
        const updatedAttendances = [...prev];
        const attendance = updatedAttendances[0];
        if (attendance) {
          attendance.students = attendance.students.map(student => 
            student.id === studentId ? { ...student, status } : student
          );
        }
        return updatedAttendances;
      });

      toast({
        title: "Status atualizado",
        description: "O status de presença foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error('Error updating attendance:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Ocorreu um erro ao atualizar o status de presença.",
        variant: "destructive"
      });
    }
  };

  const handleObservationChange = async (text: string) => {
    if (!selectedDate || !currentUser?.companyId) return;
    setObservation(text);
  };

  const startAttendance = async () => {
    if (!selectedDate || !currentUser?.companyId) return;

    try {
      const students = await attendanceDataService.getCompanyStudents(currentUser.companyId);
      const dateStr = formatDate(selectedDate);

      for (const student of students) {
        await attendanceDataService.saveAttendance({
          date: dateStr,
          studentId: student.id,
          status: "" as AttendanceStudent["status"],
          companyId: currentUser.companyId
        });
      }

      setAttendanceDays(prev => [...prev, normalizeDate(selectedDate)]);
      setDailyAttendances([{ 
        date: dateStr, 
        students: students.map(student => ({
          ...student,
          status: "" as AttendanceStudent["status"]
        }))
      }]);

      toast({
        title: "Chamada iniciada",
        description: "A chamada foi iniciada para o dia selecionado.",
      });
    } catch (error) {
      console.error('Error starting attendance:', error);
      toast({
        title: "Erro ao iniciar chamada",
        description: "Ocorreu um erro ao iniciar a chamada.",
        variant: "destructive"
      });
    }
  };

  const cancelAttendance = async () => {
    if (!selectedDate || !currentUser?.companyId) return;

    try {
      const dateStr = formatDate(selectedDate);
      await attendanceDataService.cancelAttendance(dateStr, currentUser.companyId);
      
      setAttendanceDays(prev => prev.filter(date => 
        !areDatesEqual(normalizeDate(date), normalizeDate(selectedDate))
      ));
      setDailyAttendances([]);
      setObservation('');

      toast({
        title: "Chamada cancelada",
        description: "A chamada foi cancelada para o dia selecionado.",
      });
    } catch (error) {
      console.error('Error canceling attendance:', error);
      toast({
        title: "Erro ao cancelar chamada",
        description: "Ocorreu um erro ao cancelar a chamada.",
        variant: "destructive"
      });
    }
  };

  const isAttendanceDay = (date: Date) => {
    const normalizedDate = normalizeDate(date);
    return attendanceDays.some(attendanceDate => 
      areDatesEqual(normalizeDate(date), attendanceDate)
    );
  };

  return {
    observation,
    attendanceDays,
    handleStatusChange,
    handleObservationChange,
    startAttendance,
    cancelAttendance,
    isAttendanceDay,
    getCurrentDayStudents: () => {
      if (!selectedDate) return [];
      const dateStr = formatDate(selectedDate);
      const attendance = dailyAttendances.find(da => da.date === dateStr);
      return attendance?.students || [];
    }
  };
}