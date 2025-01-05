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

interface AttendanceData {
  name: string;
  presente: number;
  falta: number;
  atrasado: number;
  justificado: number;
}

interface AttendanceChartProps {
  data: AttendanceData[];
}

const STATUS_COLORS = {
  presente: "#22c55e",
  falta: "#ef4444",
  atrasado: "#eab308",
  justificado: "#3b82f6"
};

const STATUS_LABELS = {
  presente: "Presenças",
  falta: "Faltas",
  atrasado: "Atrasos",
  justificado: "Justificados"
};

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
          Nenhum dado disponível para o período selecionado
        </CardContent>
      </Card>
    );
  }

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
                formatter={(value: number, name: string) => [
                  `${value} alunos`,
                  STATUS_LABELS[name as keyof typeof STATUS_LABELS] || name
                ]}
              />
              <Legend 
                formatter={(value) => STATUS_LABELS[value as keyof typeof STATUS_LABELS] || value}
              />
              {Object.entries(STATUS_COLORS).map(([status, color]) => (
                <Bar
                  key={status}
                  dataKey={status}
                  fill={color}
                  name={status}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};