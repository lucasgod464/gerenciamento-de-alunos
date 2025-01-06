import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { FormField } from "@/types/form";
import { Student } from "@/types/student";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const COLORS = ['#22c55e', '#ef4444', '#3b82f6', '#eab308', '#8b5cf6', '#ec4899'];

export const CustomFieldsChart = () => {
  const [fields, setFields] = useState<FormField[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedField, setSelectedField] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadFields = async () => {
      try {
        if (!user?.companyId) return;

        const { data: formFields, error } = await supabase
          .from("admin_form_fields")
          .select("*")
          .eq("company_id", user.companyId)
          .eq("type", "select")
          .order("order");

        if (error) throw error;

        setFields(formFields);
        if (formFields.length > 0) {
          setSelectedField(formFields[0].name);
        }
      } catch (error) {
        console.error("Erro ao carregar campos:", error);
        toast({
          title: "Erro ao carregar campos",
          description: "Não foi possível carregar os campos personalizados.",
          variant: "destructive",
        });
      }
    };

    const loadStudents = async () => {
      try {
        if (!user?.companyId) return;

        const { data: studentsData, error } = await supabase
          .from("students")
          .select("*")
          .eq("company_id", user.companyId);

        if (error) throw error;

        setStudents(studentsData);
      } catch (error) {
        console.error("Erro ao carregar alunos:", error);
        toast({
          title: "Erro ao carregar alunos",
          description: "Não foi possível carregar os dados dos alunos.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadFields();
    loadStudents();
  }, [user?.companyId, toast]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carregando dados...</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (fields.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nenhum campo personalizado encontrado</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground">
          Adicione campos personalizados do tipo "select" para visualizar gráficos
        </CardContent>
      </Card>
    );
  }

  const selectedFieldData = fields.find(f => f.name === selectedField);
  if (!selectedFieldData) return null;

  const chartData = (selectedFieldData.options || []).map(option => {
    const count = students.filter(
      student => student.customFields?.[selectedField] === option
    ).length;

    return {
      name: option,
      value: count
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Distribuição - {selectedFieldData.label}</span>
          <select
            className="text-sm border rounded-md px-2 py-1"
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
          >
            {fields.map((field) => (
              <option key={field.id} value={field.name}>
                {field.label}
              </option>
            ))}
          </select>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={150}
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
      </CardContent>
    </Card>
  );
};