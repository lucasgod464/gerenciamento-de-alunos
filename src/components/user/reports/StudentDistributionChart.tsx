import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Room } from "@/types/room";
import { format } from "date-fns";

interface StudentDistributionChartProps {
  rooms: Room[];
  selectedRoom: string;
  currentDate: Date;
  attendanceData: Array<{
    name: string;
    presente: number;
    falta: number;
    atrasado: number;
    justificado: number;
  }>;
}

export const StudentDistributionChart = ({ 
  rooms, 
  selectedRoom,
  currentDate,
  attendanceData 
}: StudentDistributionChartProps) => {
  // Calcular total de cada status
  const totalPresentes = attendanceData.reduce((acc, curr) => acc + curr.presente, 0);
  const totalFaltas = attendanceData.reduce((acc, curr) => acc + curr.falta, 0);
  const totalAtrasados = attendanceData.reduce((acc, curr) => acc + curr.atrasado, 0);
  const totalJustificados = attendanceData.reduce((acc, curr) => acc + curr.justificado, 0);
  const totalGeral = totalPresentes + totalFaltas + totalAtrasados + totalJustificados;
  
  // Preparar dados para o gráfico
  const chartData = [
    {
      name: "Estatísticas Gerais",
      "Taxa de Presença": totalGeral > 0 ? Math.round((totalPresentes / totalGeral) * 100) : 0,
      "Taxa de Faltas": totalGeral > 0 ? Math.round((totalFaltas / totalGeral) * 100) : 0,
      "Taxa de Atrasos": totalGeral > 0 ? Math.round((totalAtrasados / totalGeral) * 100) : 0,
      "Taxa de Justificativas": totalGeral > 0 ? Math.round((totalJustificados / totalGeral) * 100) : 0,
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          Estatísticas de Presença - {format(currentDate, 'MMMM/yyyy')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis unit="%" />
              <Tooltip formatter={(value: number) => [`${value}%`, '']} />
              <Legend />
              <Bar 
                dataKey="Taxa de Presença" 
                fill="#22c55e" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="Taxa de Faltas" 
                fill="#ef4444" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="Taxa de Atrasos" 
                fill="#eab308" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="Taxa de Justificativas" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};