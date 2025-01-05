import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { AttendanceBarChart } from "./chart/AttendanceBarChart";
import { STATUS_COLORS, STATUS_LABELS } from "./chart/ChartConfig";

interface AttendanceChartProps {
  data: any[];
}

export const AttendanceChart = ({ data }: AttendanceChartProps) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            Relatório de Presença
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          Nenhum dado disponível
        </CardContent>
      </Card>
    );
  }

  const chartData = Object.entries(STATUS_LABELS)
    .map(([key, label]) => {
      const count = data.filter(item => item.status === key).length;
      return {
        name: label,
        value: count,
        percentage: (count / data.length) * 100
      };
    })
    .filter(item => item.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          Relatório de Presença
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] space-y-6">
          <AttendanceBarChart data={chartData} />
        </div>
      </CardContent>
    </Card>
  );
};