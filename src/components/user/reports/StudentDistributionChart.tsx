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
import { ptBR } from "date-fns/locale";

interface StudentDistributionChartProps {
  rooms: Room[];
  selectedRoom: string;
  currentDate: Date;
  attendanceData: Array<{
    name: string;
    presente: number;
    ausente: number;
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
  // Calcular totais do mês
  const totalPresentes = attendanceData.reduce((acc, curr) => acc + curr.presente, 0);
  const totalAusentes = attendanceData.reduce((acc, curr) => acc + curr.ausente, 0);
  const totalAtrasados = attendanceData.reduce((acc, curr) => acc + curr.atrasado, 0);
  const totalJustificados = attendanceData.reduce((acc, curr) => acc + curr.justificado, 0);
  const totalGeral = totalPresentes + totalAusentes + totalAtrasados + totalJustificados;
  
  // Preparar dados para o gráfico
  const chartData = selectedRoom === "all" 
    ? [{
        name: "Total Geral",
        "Presentes": totalPresentes,
        "Ausentes": totalAusentes,
        "Atrasados": totalAtrasados,
        "Justificados": totalJustificados,
        "Taxa de Presença": totalGeral > 0 
          ? Math.round((totalPresentes / totalGeral) * 100) 
          : 0
      }]
    : rooms
        .filter(room => room.id === selectedRoom)
        .map(room => {
          const roomPresentes = attendanceData.reduce((acc, curr) => acc + curr.presente, 0);
          const roomAusentes = attendanceData.reduce((acc, curr) => acc + curr.ausente, 0);
          const roomAtrasados = attendanceData.reduce((acc, curr) => acc + curr.atrasado, 0);
          const roomJustificados = attendanceData.reduce((acc, curr) => acc + curr.justificado, 0);
          const total = roomPresentes + roomAusentes + roomAtrasados + roomJustificados;
          
          return {
            name: room.name,
            "Presentes": roomPresentes,
            "Ausentes": roomAusentes,
            "Atrasados": roomAtrasados,
            "Justificados": roomJustificados,
            "Taxa de Presença": total > 0 
              ? Math.round((roomPresentes / total) * 100)
              : 0
          };
        });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          Estatísticas de Presença - {format(currentDate, 'MMMM/yyyy', { locale: ptBR })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="Presentes" 
                fill="#22c55e" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="Ausentes" 
                fill="#ef4444" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="Atrasados" 
                fill="#eab308" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="Justificados" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="Taxa de Presença" 
                fill="#a855f7" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};