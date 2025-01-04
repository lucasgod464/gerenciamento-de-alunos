import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ptBR } from "date-fns/locale";

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
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Modifiers para o calendário
  const modifiers = {
    attendance: attendanceDays.map(date => new Date(formatDate(date)))
  };

  // Estilos dos modifiers
  const modifiersStyles = {
    attendance: {
      backgroundColor: "#22c55e",
      color: "white",
      borderRadius: "50%"
    }
  };

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
            onSelect={onSelectDate}
            className="rounded-md border"
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            disabled={{ before: new Date(2000, 0) }}
            locale={ptBR}
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