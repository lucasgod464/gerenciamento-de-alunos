import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Student } from "@/types/attendance";

interface AttendanceStatsProps {
  students: Student[];
}

export const AttendanceStats = ({ students = [] }: AttendanceStatsProps) => {
  const getAttendanceStats = () => {
    if (!Array.isArray(students)) {
      console.error('students prop is not an array:', students);
      return [];
    }

    const stats = students.reduce(
      (acc, student) => {
        if (student?.status === "present") acc.present += 1;
        else if (student?.status === "absent") acc.absent += 1;
        else if (student?.status === "late") acc.late += 1;
        else if (student?.status === "justified") acc.justified += 1;
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
    <Card>
      <CardHeader>
        <CardTitle>Estatísticas de Presença</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={getAttendanceStats()}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {getAttendanceStats().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};