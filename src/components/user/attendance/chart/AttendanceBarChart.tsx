import { BarChart, Bar, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { STATUS_COLORS, CustomTooltip, CustomLegend } from "./ChartConfig";

interface ChartData {
  name: string;
  value: number;
  percentage: number;
}

interface AttendanceBarChartProps {
  data: ChartData[];
}

export const AttendanceBarChart = ({ data }: AttendanceBarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <Bar
            key={status}
            dataKey="value"
            fill={color}
            name={status}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};
