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
  setObservation: (text: string) => void
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

      // Primeiro salva no banco de dados
      for (const student of students) {
        await attendanceDataService.saveAttendance({
          date: dateStr,
          studentId: student.id,
          status: "",
          companyId: currentUser.companyId
        });
      }

      // Depois atualiza o estado local
      const normalizedDate = normalizeDate(selectedDate);
      setAttendanceDays(prev => [...prev, normalizedDate]);
      setDailyAttendances([{ 
        date: dateStr, 
        students: students.map(student => ({
          ...student,
          status: ""
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
      
      // Primeiro deleta do banco de dados
      await attendanceDataService.cancelAttendance(dateStr, currentUser.companyId);
      
      // Depois atualiza o estado local
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
    handleStatusChange,
    handleObservationChange,
    startAttendance,
    cancelAttendance,
    isAttendanceDay
  };
}