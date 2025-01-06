import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { ChartPie } from "lucide-react";
import { useCustomFieldsData } from "./charts/useCustomFieldsData";
import { useChartData } from "./charts/useChartData";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const CustomFieldsChart = () => {
  const [selectedField, setSelectedField] = useState<string>("");
  const { user } = useAuth();
  const { fields, students, isLoading } = useCustomFieldsData(user?.companyId);
  const chartData = useChartData(selectedField, students, fields);

  if (isLoading) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChartPie className="h-5 w-5 text-muted-foreground" />
            Distribuição por Campo Personalizado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px]">
            Carregando...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!fields.length) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChartPie className="h-5 w-5 text-muted-foreground" />
            Distribuição por Campo Personalizado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            Nenhum campo personalizado encontrado
          </div>
        </CardContent>
      </Card>
    );
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

        {chartData.length > 0 ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} (${percentage}%)`}
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
        ) : selectedField ? (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            Nenhum dado disponível para este campo
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};