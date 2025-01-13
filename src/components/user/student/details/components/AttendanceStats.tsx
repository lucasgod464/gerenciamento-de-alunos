import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AttendanceStatsProps {
  stats: {
    present: number;
    absent: number;
    late: number;
    justified: number;
  };
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
}

export function AttendanceStats({ stats, dateRange }: AttendanceStatsProps) {
  return (
    <Card className="p-4">
      <h4 className="font-medium mb-2">
        Resumo do Período ({format(dateRange.startDate, "dd/MM/yyyy", { locale: ptBR })} - {format(dateRange.endDate, "dd/MM/yyyy", { locale: ptBR })})
      </h4>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-green-100 text-green-800 p-2 rounded-md">
          <p className="text-sm">Presentes</p>
          <p className="text-lg font-bold">{stats.present}</p>
        </div>
        <div className="bg-red-100 text-red-800 p-2 rounded-md">
          <p className="text-sm">Faltas</p>
          <p className="text-lg font-bold">{stats.absent}</p>
        </div>
        <div className="bg-yellow-100 text-yellow-800 p-2 rounded-md">
          <p className="text-sm">Atrasos</p>
          <p className="text-lg font-bold">{stats.late}</p>
        </div>
        <div className="bg-blue-100 text-blue-800 p-2 rounded-md">
          <p className="text-sm">Justificadas</p>
          <p className="text-lg font-bold">{stats.justified}</p>
        </div>
      </div>
    </Card>
  );
}
