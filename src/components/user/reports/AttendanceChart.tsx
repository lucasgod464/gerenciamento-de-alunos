import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import {
  BarChart,
  Bar,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
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
          Nenhum dado disponível
        </CardContent>
      </Card>
    );
  }

  // Transformar os dados para mostrar apenas os totais
  const transformedData = [{
    name: "Total",
    presente: data.reduce((acc, curr) => acc + curr.presente, 0),
    falta: data.reduce((acc, curr) => acc + curr.falta, 0),
    atrasado: data.reduce((acc, curr) => acc + curr.atrasado, 0),
    justificado: data.reduce((acc, curr) => acc + curr.justificado, 0)
  }];

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
            <BarChart data={transformedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <YAxis />
              {Object.entries(STATUS_COLORS).map(([status, color]) => (
                <Bar
                  key={status}
                  dataKey={status}
                  fill={color}
                  name={STATUS_LABELS[status as keyof typeof STATUS_LABELS]}
                  radius={[4, 4, 0, 0]}
                >
                  <LabelList
                    dataKey={status}
                    position="center"
                    content={({ value }) => (
                      <text
                        x={value as number}
                        y={value as number}
                        fill="#fff"
                        textAnchor="middle"
                        dy={-10}
                      >
                        {`${value} ${value === 1 ? 'aluno' : 'alunos'}`}
                      </text>
                    )}
                  />
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};