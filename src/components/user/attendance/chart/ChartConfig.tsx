import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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

export const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 border rounded shadow-sm">
        <p className="text-sm">
          {data.value} alunos ({data.percentage?.toFixed(1)}%)
        </p>
      </div>
    );
  }
  return null;
};

export const CustomLegend = (props: any) => {
  const { payload } = props;
  if (!payload) return null;
  
  return (
    <div className="flex flex-col gap-2 mt-4">
      {payload.map((entry: any, index: number) => {
        if (!entry || !entry.payload) return null;
        
        return (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">
              {entry.value}: {entry.payload.value} ({entry.payload.percentage?.toFixed(1)}%)
            </span>
          </div>
        );
      })}
    </div>
  );
};