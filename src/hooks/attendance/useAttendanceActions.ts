import { AttendanceStudent } from "@/services/attendance/types";
import { attendanceDataService } from "@/services/attendance/attendanceDataService";
import { formatDate, areDatesEqual, normalizeDate } from "@/utils/dateUtils";
import { useToast } from "@/hooks/use-toast";

export function useAttendanceActions(
  selectedDate: Date | undefined,
  currentUser: any,
  attendanceDays: Date[],
  setAttendanceDays: (days: Date[]) => void,
  setDailyAttendances: (attendance: any[]) => void,
  setObservation: (text: string) => void,
  fetchAttendanceDays: () => Promise<void>,
  fetchDailyAttendance: () => Promise<void>
) {
  const { toast } = useToast();

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
    
    try {
      await attendanceDataService.saveObservation({
        date: formatDate(selectedDate),
        text,
        companyId: currentUser.companyId
      });
      setObservation(text);
      toast({
        title: "Observação salva",
        description: "A observação foi salva com sucesso."
      });
    } catch (error) {
      console.error('Error saving observation:', error);
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
      const students = await attendanceDataService.getCompanyStudents(currentUser.companyId);
      const dateStr = formatDate(selectedDate);

      for (const student of students) {
        await attendanceDataService.saveAttendance({
          date: dateStr,
          studentId: student.id,
          status: "",
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
      const dateStr = formatDate(selectedDate);
      
      await attendanceDataService.cancelAttendance(dateStr, currentUser.companyId);
      
      await fetchAttendanceDays();
      await fetchDailyAttendance();

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
      areDatesEqual(normalizeDate(attendanceDate), normalizedDate)
    );
  };

  return {
    handleStatusChange,
    handleObservationChange,
    startAttendance,
    cancelAttendance,
    isAttendanceDay
  };
}