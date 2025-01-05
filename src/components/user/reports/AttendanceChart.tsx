import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import {
  BarChart,
  Bar,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
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

export const STATUS_COLORS = {
  presente: "#22c55e",
  falta: "#ef4444",
  atrasado: "#eab308",
  justificado: "#3b82f6"
};

export const STATUS_LABELS = {
  presente: "Presenças",
  falta: "Faltas",
  atrasado: "Atrasos",
  justificado: "Justificados"
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const dataKey = payload[0].dataKey;
    const label = STATUS_LABELS[dataKey as keyof typeof STATUS_LABELS];
    return (
      <div className="bg-white p-2 border rounded shadow-sm">
        <p className="text-sm">
          {data[dataKey]} {label}
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = (props: any) => {
  const { payload } = props;
  if (!payload) return null;
  
  return (
    <div className="flex flex-col gap-2 mt-4">
      {payload.map((entry: any, index: number) => {
        if (!entry || !entry.payload) return null;
        const dataKey = entry.dataKey;
        const label = STATUS_LABELS[dataKey as keyof typeof STATUS_LABELS];
        
        return (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">
              {label}: {entry.payload[dataKey]} ({((entry.payload[dataKey] / Object.values(entry.payload).reduce((acc: number, val: any) => typeof val === 'number' ? acc + val : acc, 0)) * 100).toFixed(1)}%)
            </span>
          </div>
        );
      })}
    </div>
  );
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
              <YAxis />
              <Legend content={<CustomLegend />} />
              {Object.entries(STATUS_COLORS).map(([status, color]) => (
                <Bar
                  key={status}
                  dataKey={status}
                  fill={color}
                  name={status}
                  radius={[4, 4, 0, 0]}
                >
                  <LabelList
                    dataKey={status}
                    position="center"
                    fill="#fff"
                    formatter={(value: number) => {
                      const label = STATUS_LABELS[status as keyof typeof STATUS_LABELS];
                      return `${value} ${label}`;
                    }}
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