import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PeriodSelectorProps {
  onPeriodChange: (value: string) => void;
}

export function PeriodSelector({ onPeriodChange }: PeriodSelectorProps) {
  return (
    <div className="flex mb-4">
      <Select defaultValue="last30days" onValueChange={onPeriodChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Período predefinido" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="last30days">Últimos 30 dias</SelectItem>
          <SelectItem value="lastYear">Último ano</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}