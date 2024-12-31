import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AttendanceCalendarProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  attendanceDays: Date[];
  onStartAttendance: () => void;
  isAttendanceDay: (date: Date) => boolean;
}

export const AttendanceCalendar = ({
  selectedDate,
  onSelectDate,
  attendanceDays,
  onStartAttendance,
  isAttendanceDay,
}: AttendanceCalendarProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendário</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          className="rounded-md border"
          modifiers={{
            attendance: attendanceDays
          }}
          modifiersStyles={{
            attendance: {
              backgroundColor: "#22c55e",
              color: "white",
              borderRadius: "50%"
            }
          }}
        />
        <Button 
          onClick={onStartAttendance}
          disabled={!selectedDate || isAttendanceDay(selectedDate)}
          className="w-full"
        >
          Iniciar Chamada
        </Button>
      </CardContent>
    </Card>
  );
};