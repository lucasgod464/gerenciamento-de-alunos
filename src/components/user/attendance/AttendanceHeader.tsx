import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { CategorySelect } from "@/components/categories/CategorySelect";
import { useState } from "react";
import { formatDate } from "@/utils/dateUtils";

interface AttendanceHeaderProps {
  onDateChange: (date: Date) => void;
  onCategoryChange: (categoryId: string) => void;
}

export function AttendanceHeader({ onDateChange, onCategoryChange }: AttendanceHeaderProps) {
  const [date, setDate] = useState<Date>(new Date());

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      onDateChange(newDate);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Data da Chamada</h3>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          className="rounded-md border"
        />
      </Card>
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Selecione a Categoria</h3>
        <CategorySelect value="" onChange={onCategoryChange} />
      </Card>
    </div>
  );
}