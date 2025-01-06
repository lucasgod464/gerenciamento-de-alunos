import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useEffect, useState } from "react";
import { Student } from "@/types/student";
import { FormField } from "@/types/form";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const COLORS = ['#22c55e', '#ef4444', '#eab308', '#3b82f6', '#8b5cf6', '#ec4899'];

interface ChartData {
  name: string;
  value: number;
}

export const CustomFieldsChart = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [customFields, setCustomFields] = useState<FormField[]>([]);
  const [selectedField, setSelectedField] = useState<string>("");
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  // Carregar campos personalizados
  useEffect(() => {
    const loadCustomFields = async () => {
      try {
        if (!user?.companyId) return;

        const { data, error } = await supabase
          .from('admin_form_fields')
          .select('*')
          .eq('company_id', user.companyId)
          .order('order');

        if (error) throw error;

        if (data) {
          setCustomFields(data);
          if (data.length > 0) {
            setSelectedField(data[0].name);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar campos:', error);
        toast({
          title: "Erro ao carregar campos",
          description: "Não foi possível carregar os campos personalizados.",
          variant: "destructive",
        });
      }
    };

    loadCustomFields();
  }, [user?.companyId]);

  // Carregar alunos
  useEffect(() => {
    const loadStudents = async () => {
      try {
        if (!user?.companyId) return;

        const { data, error } = await supabase
          .from('students')
          .select('*')
          .eq('company_id', user.companyId);

        if (error) throw error;

        if (data) {
          setStudents(data);
        }
      } catch (error) {
        console.error('Erro ao carregar alunos:', error);
        toast({
          title: "Erro ao carregar alunos",
          description: "Não foi possível carregar os alunos.",
          variant: "destructive",
        });
      }
    };

    loadStudents();
  }, [user?.companyId]);

  // Processar dados para o gráfico
  useEffect(() => {
    if (!selectedField || !students.length) return;

    const valueCount = new Map<string, number>();

    students.forEach(student => {
      const value = student.customFields[selectedField]?.toString() || "Não informado";
      valueCount.set(value, (valueCount.get(value) || 0) + 1);
    });

    const newChartData: ChartData[] = Array.from(valueCount.entries()).map(([name, value]) => ({
      name,
      value
    }));

    setChartData(newChartData);
  }, [selectedField, students]);

  if (!customFields.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Campos Personalizados</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          Nenhum campo personalizado configurado
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Campos Personalizados</span>
          <select
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            className="border rounded p-1 text-sm"
          >
            {customFields.map(field => (
              <option key={field.id} value={field.name}>
                {field.label}
              </option>
            ))}
          </select>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
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
      </CardContent>
    </Card>
  );
};