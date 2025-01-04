import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

interface AttendanceHeaderProps {
  onDateChange: (date: Date) => void;
}

export function AttendanceHeader({ onDateChange }: AttendanceHeaderProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Data da Chamada</h3>
      <Calendar
        mode="single"
        selected={new Date()}
        onSelect={(date) => date && onDateChange(date)}
        className="rounded-md border"
      />
    </div>
  );
}