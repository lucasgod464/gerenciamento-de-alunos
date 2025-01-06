import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { FormField } from "@/types/form";
import { Student } from "@/types/student";
import { ChartPie } from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface CustomField extends FormField {
  source: 'admin' | 'public';
}

export const CustomFieldsChart = () => {
  const [fields, setFields] = useState<CustomField[]>([]);
  const [selectedField, setSelectedField] = useState<string>("");
  const [chartData, setChartData] = useState<any[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const { user } = useAuth();

  // Carregar campos personalizados
  useEffect(() => {
    const loadFields = async () => {
      if (!user?.companyId) return;

      try {
        const [{ data: adminFields }, { data: publicFields }] = await Promise.all([
          supabase
            .from('admin_form_fields')
            .select('*')
            .eq('company_id', user.companyId)
            .in('type', ['select', 'multiple']),
          supabase
            .from('enrollment_form_fields')
            .select('*')
            .eq('company_id', user.companyId)
            .in('type', ['select', 'multiple'])
        ]);

        const mappedAdminFields: CustomField[] = (adminFields || []).map(field => ({
          id: field.id,
          name: field.name,
          label: field.label,
          type: field.type as FormField['type'],
          description: field.description || "",
          required: field.required || false,
          order: field.order,
          options: Array.isArray(field.options) ? field.options.map(String) : [],
          source: 'admin'
        }));

        const mappedPublicFields: CustomField[] = (publicFields || []).map(field => ({
          id: field.id,
          name: field.name,
          label: field.label,
          type: field.type as FormField['type'],
          description: field.description || "",
          required: field.required || false,
          order: field.order,
          options: Array.isArray(field.options) ? field.options.map(String) : [],
          source: 'public'
        }));

        setFields([...mappedAdminFields, ...mappedPublicFields]);
      } catch (error) {
        console.error('Erro ao carregar campos:', error);
      }
    };

    loadFields();
  }, [user?.companyId]);

  // Carregar alunos
  useEffect(() => {
    const loadStudents = async () => {
      if (!user?.companyId) return;

      try {
        const { data } = await supabase
          .from('students')
          .select('*')
          .eq('company_id', user.companyId);

        if (data) {
          const mappedStudents = data.map(student => ({
            id: student.id,
            name: student.name,
            birthDate: student.birth_date,
            status: student.status,
            email: student.email || '',
            document: student.document || '',
            address: student.address || '',
            customFields: student.custom_fields || {},
            companyId: student.company_id,
            createdAt: student.created_at
          }));
          setStudents(mappedStudents);
        }
      } catch (error) {
        console.error('Erro ao carregar alunos:', error);
      }
    };

    loadStudents();
  }, [user?.companyId]);

  // Processar dados para o gráfico
  useEffect(() => {
    if (!selectedField || !students.length) return;

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

    setChartData(data);
  }, [selectedField, students, fields]);

  if (!fields.length) {
    return null;
  }

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChartPie className="h-5 w-5 text-muted-foreground" />
          Distribuição por Campo Personalizado
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Select value={selectedField} onValueChange={setSelectedField}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um campo personalizado" />
            </SelectTrigger>
            <SelectContent>
              {fields.map((field) => (
                <SelectItem key={field.id} value={field.id}>
                  {field.label} ({field.source === 'admin' ? 'Admin' : 'Público'})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {chartData.length > 0 && (
          <div className="h-[300px]">
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
        )}
      </CardContent>
    </Card>
  );
};