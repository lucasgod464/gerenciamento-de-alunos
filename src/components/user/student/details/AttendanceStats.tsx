import { Card } from "@/components/ui/card";

interface AttendanceStatsProps {
  stats: {
    present: number;
    absent: number;
    late: number;
    justified: number;
  };
  period: {
    start: Date;
    end: Date;
  };
}

export function AttendanceStats({ stats, period }: AttendanceStatsProps) {
  return (
    <Card className="p-4">
      <h4 className="font-medium mb-2">
        Resumo do Período ({period.start.toLocaleDateString()} - {period.end.toLocaleDateString()})
      </h4>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-green-100 text-green-800 p-2 rounded-md">
          <p className="text-sm font-medium">Presenças</p>
          <p className="text-lg">{stats.present}</p>
        </div>
        <div className="bg-red-100 text-red-800 p-2 rounded-md">
          <p className="text-sm font-medium">Faltas</p>
          <p className="text-lg">{stats.absent}</p>
        </div>
        <div className="bg-yellow-100 text-yellow-800 p-2 rounded-md">
          <p className="text-sm font-medium">Atrasos</p>
          <p className="text-lg">{stats.late}</p>
        </div>
        <div className="bg-blue-100 text-blue-800 p-2 rounded-md">
          <p className="text-sm font-medium">Justificadas</p>
          <p className="text-lg">{stats.justified}</p>
        </div>
      </div>
    </Card>
  );
}