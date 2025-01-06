import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/types/form";
import { Student } from "@/types/student";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface CustomFieldsChartProps {
  fields: FormField[];
  students: Student[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const CustomFieldsChart = ({ fields, students }: CustomFieldsChartProps) => {
  const [selectedField, setSelectedField] = useState<string>("");
  const [chartData, setChartData] = useState<any[]>([]);

  // Filtra apenas campos do tipo select ou multiple
  const selectFields = fields.filter(field => 
    field.type === "select" || field.type === "multiple"
  );

  useEffect(() => {
    if (!selectedField || !students.length) return;

    const field = fields.find(f => f.id === selectedField);
    if (!field) return;

    const valueCount: Record<string, number> = {};
    let totalWithValue = 0;

    students.forEach(student => {
      const fieldValue = student.customFields?.[field.id]?.value;
      if (fieldValue) {
        valueCount[fieldValue] = (valueCount[fieldValue] || 0) + 1;
        totalWithValue++;
      }
    });

    // Adiciona "Não preenchido" para estudantes sem valor
    const notFilledCount = students.length - totalWithValue;
    if (notFilledCount > 0) {
      valueCount["Não preenchido"] = notFilledCount;
    }

    const data = Object.entries(valueCount).map(([name, value]) => ({
      name,
      value
    }));

    setChartData(data);
  }, [selectedField, students, fields]);

  if (!selectFields.length) {
    return (
      <Card className="p-4">
        <p className="text-center text-muted-foreground">
          Nenhum campo personalizado do tipo seleção encontrado.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="mb-4">
        <Select value={selectedField} onValueChange={setSelectedField}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um campo para visualizar" />
          </SelectTrigger>
          <SelectContent>
            {selectFields.map((field) => (
              <SelectItem key={field.id} value={field.id}>
                {field.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedField && chartData.length > 0 && (
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry.name}: ${entry.value}`}
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
      )}
    </Card>
  );
};