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
    presenca: number;
    faltas: number;
  }>;
}

export const StudentDistributionChart = ({ 
  rooms, 
  selectedRoom, 
  currentDate,
  attendanceData 
}: StudentDistributionChartProps) => {
  // Calcular total de presenças e faltas do mês
  const totalPresencas = attendanceData.reduce((acc, curr) => acc + curr.presenca, 0);
  const totalFaltas = attendanceData.reduce((acc, curr) => acc + curr.faltas, 0);
  const totalGeral = totalPresencas + totalFaltas;
  
  // Preparar dados para o gráfico
  const chartData = selectedRoom === "all" 
    ? [{
        name: "Total Geral",
        "Presenças": totalPresencas,
        "Faltas": totalFaltas,
        "Taxa de Presença": totalGeral > 0 
          ? Math.round((totalPresencas / totalGeral) * 100) 
          : 0
      }]
    : rooms
        .filter(room => room.id === selectedRoom)
        .map(room => {
          const roomPresencas = attendanceData.reduce((acc, curr) => acc + curr.presenca, 0);
          const roomFaltas = attendanceData.reduce((acc, curr) => acc + curr.faltas, 0);
          const total = roomPresencas + roomFaltas;
          
          return {
            name: room.name,
            "Presenças": roomPresencas,
            "Faltas": roomFaltas,
            "Taxa de Presença": total > 0 
              ? Math.round((roomPresencas / total) * 100)
              : 0
          };
        });

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
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="Presenças" 
                fill="#22c55e" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="Faltas" 
                fill="#ef4444" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="Taxa de Presença" 
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