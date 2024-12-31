import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Student } from "@/types/attendance";

interface AttendanceStatsProps {
  students: Student[];
}

export const AttendanceStats = ({ students }: AttendanceStatsProps) => {
  const getAttendanceStats = () => {
    const stats = students.reduce(
      (acc, student) => {
        if (student.status === "present") acc.present += 1;
        else if (student.status === "absent") acc.absent += 1;
        else if (student.status === "late") acc.late += 1;
        else if (student.status === "justified") acc.justified += 1;
        return acc;
      },
      { present: 0, absent: 0, late: 0, justified: 0 }
    );

    return [
      { name: "Presentes", value: stats.present, color: "#22c55e" },
      { name: "Ausentes", value: stats.absent, color: "#ef4444" },
      { name: "Atrasados", value: stats.late, color: "#f59e0b" },
      { name: "Justificados", value: stats.justified, color: "#3b82f6" },
    ];
  };

  return (
    <div className="h-[300px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={getAttendanceStats()}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({
              cx,
              cy,
              midAngle,
              innerRadius,
              outerRadius,
              value,
              index
            }) => {
              const RADIAN = Math.PI / 180;
              const radius = 25 + innerRadius + (outerRadius - innerRadius);
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);

              return (
                <text
                  x={x}
                  y={y}
                  className="text-sm"
                  textAnchor={x > cx ? 'start' : 'end'}
                  dominantBaseline="central"
                >
                  {value}
                </text>
              );
            }}
          >
            {getAttendanceStats().map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                className="hover:opacity-80 transition-opacity duration-200"
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry, index) => (
              <span className="text-sm font-medium">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};