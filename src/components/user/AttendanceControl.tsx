import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceStats } from "./AttendanceStats";
import { AttendanceList } from "./AttendanceList";
import { AttendanceCalendar } from "./attendance/AttendanceCalendar";
import { DailyObservations } from "./attendance/DailyObservations";
import { useAttendance } from "@/hooks/useAttendance";

export const AttendanceControl = () => {
  const {
    selectedDate,
    setSelectedDate,
    dailyAttendances,
    observation,
    attendanceDays,
    handleStatusChange,
    handleObservationChange,
    startAttendance,
    cancelAttendance,
  } = useAttendance();

  const getCurrentDayStudents = () => {
    if (!selectedDate) return [];
    const dateStr = selectedDate.toISOString().split('T')[0];
    const attendance = dailyAttendances.find(da => da.date === dateStr);
    return attendance?.students || [];
  };

  const isAttendanceDay = (date: Date) => {
    return attendanceDays.some(attendanceDate => 
      attendanceDate.toISOString().split('T')[0] === date.toISOString().split('T')[0]
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <AttendanceCalendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          attendanceDays={attendanceDays}
          onStartAttendance={startAttendance}
          isAttendanceDay={isAttendanceDay}
          onCancelAttendance={cancelAttendance}
        />
        <AttendanceStats students={getCurrentDayStudents()} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Lista de Presença - {selectedDate?.toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isAttendanceDay(selectedDate || new Date()) ? (
              <>
                <AttendanceList
                  students={getCurrentDayStudents()}
                  onStatusChange={handleStatusChange}
                  date={selectedDate || new Date()}
                />
                <DailyObservations
                  observation={observation}
                  onObservationChange={handleObservationChange}
                />
              </>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Clique em "Iniciar Chamada" para começar a registrar as presenças deste dia.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};