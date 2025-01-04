import { useAuth } from "@/hooks/useAuth";
import { useAttendanceState } from "./attendance/useAttendanceState";
import { useAttendanceActions } from "./attendance/useAttendanceActions";
import { formatDate, normalizeDate } from "@/utils/dateUtils";

export function useAttendance(selectedDate: Date | undefined) {
  const { user: currentUser } = useAuth();
  
  const {
    dailyAttendances,
    setDailyAttendances,
    observation,
    setObservation,
    attendanceDays,
    setAttendanceDays,
    fetchAttendanceDays,
    fetchDailyAttendance
  } = useAttendanceState(selectedDate, currentUser);

  const {
    handleStatusChange,
    handleObservationChange,
    startAttendance,
    cancelAttendance,
    isAttendanceDay
  } = useAttendanceActions(
    selectedDate,
    currentUser,
    attendanceDays,
    setAttendanceDays,
    setDailyAttendances,
    setObservation,
    fetchAttendanceDays,
    fetchDailyAttendance
  );

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