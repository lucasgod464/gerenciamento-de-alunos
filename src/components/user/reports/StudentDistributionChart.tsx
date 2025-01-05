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

interface StudentDistributionChartProps {
  rooms: Room[];
}

export const StudentDistributionChart = ({ rooms }: StudentDistributionChartProps) => {
  // Calcular estatísticas por sala
  const roomStats = rooms.map(room => {
    const totalStudents = room.room_students?.length || 0;
    const presentStudents = room.room_students?.filter(student => 
      student.students?.status
    ).length || 0;
    const attendanceRate = totalStudents > 0 
      ? Math.round((presentStudents / totalStudents) * 100) 
      : 0;

    return {
      name: room.name,
      "Total de Alunos": totalStudents,
      "Taxa de Frequência": attendanceRate,
      "Alunos Ativos": presentStudents,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          Estatísticas por Sala
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={roomStats}
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
                dataKey="Total de Alunos" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="Alunos Ativos" 
                fill="#22c55e" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="Taxa de Frequência" 
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