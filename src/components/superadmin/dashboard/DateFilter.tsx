import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { addDays, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek, subDays, subMonths, subWeeks, subYears } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface DateRange {
  from: Date;
  to: Date;
}

interface DateFilterProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export const DateFilter = ({ dateRange, onDateRangeChange }: DateFilterProps) => {
  const handlePresetChange = (value: string) => {
    const today = new Date();
    let newRange: DateRange;

    switch (value) {
      case "today":
        newRange = { from: today, to: today };
        break;
      case "yesterday":
        const yesterday = subDays(today, 1);
        newRange = { from: yesterday, to: yesterday };
        break;
      case "last7days":
        newRange = { from: subDays(today, 6), to: today };
        break;
      case "last30days":
        newRange = { from: subDays(today, 29), to: today };
        break;
      case "thisMonth":
        newRange = { from: startOfMonth(today), to: endOfMonth(today) };
        break;
      case "lastMonth":
        const lastMonth = subMonths(today, 1);
        newRange = { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
        break;
      case "thisWeek":
        newRange = { from: startOfWeek(today, { locale: ptBR }), to: endOfWeek(today, { locale: ptBR }) };
        break;
      case "lastWeek":
        const lastWeek = subWeeks(today, 1);
        newRange = { 
          from: startOfWeek(lastWeek, { locale: ptBR }), 
          to: endOfWeek(lastWeek, { locale: ptBR }) 
        };
        break;
      case "lastYear":
        newRange = { from: subYears(today, 1), to: today };
        break;
      default:
        return;
    }

    onDateRangeChange(newRange);
  };

  const handlePreviousPeriod = () => {
    if (!dateRange.from || !dateRange.to) return;
    
    const duration = dateRange.to.getTime() - dateRange.from.getTime();
    const newFrom = new Date(dateRange.from.getTime() - duration);
    const newTo = new Date(dateRange.to.getTime() - duration);
    
    onDateRangeChange({ from: newFrom, to: newTo });
  };

  const handleNextPeriod = () => {
    if (!dateRange.from || !dateRange.to) return;
    
    const duration = dateRange.to.getTime() - dateRange.from.getTime();
    const newFrom = new Date(dateRange.from.getTime() + duration);
    const newTo = new Date(dateRange.to.getTime() + duration);
    
    onDateRangeChange({ from: newFrom, to: newTo });
  };

  return (
    <div className="flex items-center gap-2">
      <Select defaultValue="last30days" onValueChange={handlePresetChange}>
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
          <SelectItem value="lastYear">Último ano</SelectItem>
        </SelectContent>
      </Select>

      <Button 
        variant="outline" 
        size="icon"
        onClick={handlePreviousPeriod}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal w-[280px]",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                  {format(dateRange.to, "dd/MM/yyyy")}
                </>
              ) : (
                format(dateRange.from, "dd/MM/yyyy")
              )
            ) : (
              <span>Selecione um período</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={{
              from: dateRange.from,
              to: dateRange.to
            }}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                onDateRangeChange({ from: range.from, to: range.to });
              }
            }}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>

      <Button 
        variant="outline" 
        size="icon"
        onClick={handleNextPeriod}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};