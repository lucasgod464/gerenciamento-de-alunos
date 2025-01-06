import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCustomFields } from "@/hooks/useCustomFields";
import { useStudentData } from "@/components/user/student/hooks/useStudentData";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const CustomFieldsChart = () => {
  const { fields } = useCustomFields();
  const { students } = useStudentData();
  const [selectedField, setSelectedField] = useState<string>("");
  const [chartData, setChartData] = useState<Array<{ name: string; value: number }>>([]);

  // Filtrar apenas campos do tipo select ou multiple
  const selectFields = fields.filter(field => 
    field.type === "select" || field.type === "multiple"
  );

  useEffect(() => {
    if (!selectedField || !students.length) return;

    const field = fields.find(f => f.id === selectedField);
    if (!field) return;

    const valueCount: Record<string, number> = {};
    
    students.forEach(student => {
      const fieldValue = student.customFields[field.name];
      
      if (Array.isArray(fieldValue)) {
        // Para campos multiple
        fieldValue.forEach(value => {
          valueCount[value] = (valueCount[value] || 0) + 1;
        });
      } else if (fieldValue) {
        // Para campos select
        valueCount[fieldValue] = (valueCount[fieldValue] || 0) + 1;
      }
    });

    const data = Object.entries(valueCount).map(([name, value]) => ({
      name,
      value
    }));

    setChartData(data);
  }, [selectedField, students, fields]);

  if (!selectFields.length) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">
          Nenhum campo personalizado do tipo seleção encontrado.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <Select value={selectedField} onValueChange={setSelectedField}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione um campo para visualizar" />
          </SelectTrigger>
          <SelectContent>
            {selectFields.map(field => (
              <SelectItem key={field.id} value={field.id}>
                {field.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedField && chartData.length > 0 ? (
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          Selecione um campo para visualizar os dados
        </p>
      )}
    </Card>
  );
};