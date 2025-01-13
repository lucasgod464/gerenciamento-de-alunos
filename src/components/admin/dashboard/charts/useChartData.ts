import { useState, useEffect } from "react";
import { FormField } from "@/types/form";
import { Student } from "@/types/student";

export const useChartData = (
  selectedFields: string[],
  students: Student[],
  fields: FormField[],
  mergeIdenticalValues: boolean = false
) => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (!selectedFields.length || !students.length) return;

    console.log("Processando dados para o gráfico...");
    console.log("Campos selecionados:", selectedFields);
    console.log("Campos disponíveis:", fields);
    console.log("Mesclar valores idênticos:", mergeIdenticalValues);

    const selectedFieldsData = fields.filter(f => selectedFields.includes(f.id));
    if (!selectedFieldsData.length) return;

    const valueCount: Record<string, number> = {};
    let totalResponses = 0;
    
    students.forEach(student => {
      if (!student.customFields) return;
      
      selectedFields.forEach(fieldId => {
        const fieldValue = student.customFields[fieldId]?.value;
        if (!fieldValue) return;

        // Lidar com valores múltiplos (array) ou único
        const values = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
        
        values.forEach(value => {
          if (value && value.trim() !== '') {
            const field = selectedFieldsData.find(f => f.id === fieldId);
            // Se mergeIdenticalValues for true, usa apenas o valor sem o prefixo do campo
            const label = mergeIdenticalValues 
              ? value.trim()
              : field ? `${field.label}: ${value}` : value;
            valueCount[label] = (valueCount[label] || 0) + 1;
            totalResponses++;
          }
        });
      });
    });

    // Calcular porcentagens e criar dados do gráfico
    const data = Object.entries(valueCount).map(([name, value]) => ({
      name,
      value,
      percentage: Number(((value / totalResponses) * 100).toFixed(1))
    }));

    console.log("Dados processados para o gráfico:", data);
    setChartData(data);
  }, [selectedFields, students, fields, mergeIdenticalValues]);

  return chartData;
};
