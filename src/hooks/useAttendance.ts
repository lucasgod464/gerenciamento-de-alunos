import { useState, useEffect } from "react";
import { AttendanceStudent, DailyAttendance, DailyObservation } from "@/services/attendance/types";
import { attendanceService } from "@/services/attendance/attendanceService";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export function useAttendance(selectedDate: Date | undefined) {
  const [dailyAttendances, setDailyAttendances] = useState<DailyAttendance[]>([]);
  const [observation, setObservation] = useState("");
  const [observations, setObservations] = useState<DailyObservation[]>([]);
  const [attendanceDays, setAttendanceDays] = useState<Date[]>([]);
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  const fetchAttendanceDays = async () => {
    if (!currentUser?.companyId) return;

    try {
      const days = await attendanceService.getAttendanceDays(currentUser.companyId);
      setAttendanceDays(days);
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

    const dateStr = selectedDate.toISOString().split('T')[0];
    
    try {
      const attendanceData = await attendanceService.getDailyAttendance(dateStr, currentUser.companyId);

      if (attendanceData.length === 0) {
        const students = await attendanceService.getCompanyStudents(currentUser.companyId);
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
  }, [selectedDate, currentUser]);

  const handleStatusChange = async (studentId: string, status: AttendanceStudent["status"]) => {
    if (!selectedDate || !currentUser?.companyId) return;
    
    const dateStr = selectedDate.toISOString().split('T')[0];

    try {
      await attendanceService.saveAttendance({
        date: dateStr,
        studentId,
        status,
        companyId: currentUser.companyId
      });

      await fetchDailyAttendance();

      toast({
        title: "Status atualizado",
        description: "O status de presença foi atualizado com sucesso."
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
    
    const dateStr = selectedDate.toISOString().split('T')[0];

    try {
      await attendanceService.saveObservation({
        date: dateStr,
        text,
        companyId: currentUser.companyId
      });

      setObservation(text);
    } catch (error) {
      console.error('Error updating observation:', error);
      toast({
        title: "Erro ao salvar observação",
        description: "Ocorreu um erro ao salvar a observação.",
        variant: "destructive"
      });
    }
  };

  const startAttendance = async () => {
    if (!selectedDate || !currentUser?.companyId) return;

    try {
      const students = await attendanceService.getCompanyStudents(currentUser.companyId);
      const dateStr = selectedDate.toISOString().split('T')[0];

      for (const student of students) {
        await attendanceService.saveAttendance({
          date: dateStr,
          studentId: student.id,
          status: 'present',
          companyId: currentUser.companyId
        });
      }

      await fetchAttendanceDays();
      await fetchDailyAttendance();

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
      const dateStr = selectedDate.toISOString().split('T')[0];

      const { error: attendanceError } = await supabase
        .from('daily_attendance')
        .delete()
        .eq('date', dateStr)
        .eq('company_id', currentUser.companyId);

      if (attendanceError) throw attendanceError;

      const { error: observationError } = await supabase
        .from('daily_observations')
        .delete()
        .eq('date', dateStr)
        .eq('company_id', currentUser.companyId);

      if (observationError) throw observationError;

      await fetchAttendanceDays();
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
    return attendanceDays.some(attendanceDate => 
      attendanceDate.toISOString().split('T')[0] === date.toISOString().split('T')[0]
    );
  };

  return {
    dailyAttendances,
    observation,
    observations,
    attendanceDays,
    handleStatusChange,
    handleObservationChange,
    startAttendance,
    cancelAttendance,
    isAttendanceDay,
    getCurrentDayStudents: () => {
      if (!selectedDate) return [];
      const dateStr = selectedDate.toISOString().split('T')[0];
      const attendance = dailyAttendances.find(da => da.date === dateStr);
      return attendance?.students || [];
    }
  };
}