import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addDays, endOfMonth, endOfWeek, startOfMonth, startOfWeek, subDays, subMonths, subWeeks } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DateRangeSelector } from "./DateRangeSelector";

interface PeriodSelectorProps {
  startDate: Date;
  endDate: Date;
  onDateChange: (start: Date, end: Date) => void;
}

export function PeriodSelector({ startDate, endDate, onDateChange }: PeriodSelectorProps) {
  const handlePresetChange = (value: string) => {
    const today = new Date();
    
    switch (value) {
      case "today":
        onDateChange(today, today);
        break;
      case "yesterday":
        const yesterday = subDays(today, 1);
        onDateChange(yesterday, yesterday);
        break;
      case "last7days":
        onDateChange(subDays(today, 6), today);
        break;
      case "last30days":
        onDateChange(subDays(today, 29), today);
        break;
      case "thisMonth":
        onDateChange(startOfMonth(today), endOfMonth(today));
        break;
      case "lastMonth":
        const lastMonth = subMonths(today, 1);
        onDateChange(startOfMonth(lastMonth), endOfMonth(lastMonth));
        break;
      case "thisWeek":
        onDateChange(startOfWeek(today, { locale: ptBR }), endOfWeek(today, { locale: ptBR }));
        break;
      case "lastWeek":
        const lastWeek = subWeeks(today, 1);
        onDateChange(startOfWeek(lastWeek, { locale: ptBR }), endOfWeek(lastWeek, { locale: ptBR }));
        break;
    }
  };

  return (
    <div className="flex gap-4 items-center">
      <Select onValueChange={handlePresetChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Período predefinido" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Hoje</SelectItem>
          <SelectItem value="yesterday">Ontem</SelectItem>
          <SelectItem value="last7days">Últimos 7 dias</SelectItem>
          <SelectItem value="last30days">Últimos 30 dias</SelectItem>
          <SelectItem value="thisWeek">Esta semana</SelectItem>
          <SelectItem value="lastWeek">Semana passada</SelectItem>
          <SelectItem value="thisMonth">Este mês</SelectItem>
          <SelectItem value="lastMonth">Mês passado</SelectItem>
        </SelectContent>
      </Select>

      <DateRangeSelector
        startDate={startDate}
        endDate={endDate}
        onDateChange={onDateChange}
      />
    </div>
  );
}