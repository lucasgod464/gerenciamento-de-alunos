import { useState, useEffect } from "react";
import { FormField } from "@/types/form";
import { Student } from "@/types/student";

export const useChartData = (
  selectedField: string,
  students: Student[],
  fields: FormField[]
) => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (!selectedField || !students.length) return;

    console.log("Processando dados para o gráfico...");
    console.log("Campo selecionado:", selectedField);
    console.log("Estudantes:", students);

    const selectedFieldData = fields.find(f => f.id === selectedField);
    if (!selectedFieldData) return;

    const valueCount: Record<string, number> = {};
    
    students.forEach(student => {
      if (!student.customFields) return;
      
      const fieldValue = student.customFields[selectedField]?.value;
      if (!fieldValue) return;

      // Lidar com valores múltiplos (array) ou único
      const values = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
      
      values.forEach(value => {
        valueCount[value] = (valueCount[value] || 0) + 1;
      });
    });

    const data = Object.entries(valueCount).map(([name, value]) => ({
      name,
      value
    }));

    console.log("Dados do gráfico:", data);
    setChartData(data);
  }, [selectedField, students, fields]);

  return chartData;
};