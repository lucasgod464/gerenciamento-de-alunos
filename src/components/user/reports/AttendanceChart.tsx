import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
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

interface AttendanceChartProps {
  data: Array<{
    name: string;
    presente: number;
    falta: number;
    atrasado: number;
    justificado: number;
  }>;
}

export const AttendanceChart = ({ data }: AttendanceChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          Relatório de Presença
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`${value} alunos`, '']}
              />
              <Legend />
              <Bar 
                dataKey="presente" 
                fill="#22c55e" 
                name="Presente" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="falta" 
                fill="#ef4444" 
                name="Falta" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="atrasado" 
                fill="#eab308" 
                name="Atrasado" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="justificado" 
                fill="#3b82f6" 
                name="Justificado" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};