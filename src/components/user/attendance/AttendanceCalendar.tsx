import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { normalizeDate } from "@/utils/dateUtils";

interface AttendanceCalendarProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  attendanceDays: Date[];
  onStartAttendance: () => void;
  isAttendanceDay: (date: Date) => boolean;
  onCancelAttendance?: () => void;
}

export const AttendanceCalendar = ({
  selectedDate,
  onSelectDate,
  attendanceDays,
  onStartAttendance,
  isAttendanceDay,
  onCancelAttendance,
}: AttendanceCalendarProps) => {
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const normalizedDate = normalizeDate(date);
      onSelectDate(normalizedDate);
    } else {
      onSelectDate(undefined);
    }
  };

  // Normaliza todas as datas de presença
  const normalizedAttendanceDays = attendanceDays.map(date => normalizeDate(date));

  // Filtra a data selecionada da lista de dias com presença
  const modifiedAttendanceDays = selectedDate 
    ? normalizedAttendanceDays.filter(date => date.getTime() !== normalizeDate(selectedDate).getTime())
    : normalizedAttendanceDays;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendário</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border"
            modifiers={{
              attendance: modifiedAttendanceDays
            }}
            modifiersStyles={{
              attendance: {
                backgroundColor: "#22c55e",
                color: "white",
                borderRadius: "50%"
              }
            }}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={onStartAttendance}
            disabled={!selectedDate || isAttendanceDay(selectedDate)}
            className="flex-1"
          >
            Iniciar Chamada
          </Button>
          {selectedDate && isAttendanceDay(selectedDate) && onCancelAttendance && (
            <Button 
              onClick={onCancelAttendance}
              variant="destructive"
              className="flex-1"
            >
              Cancelar Chamada
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};