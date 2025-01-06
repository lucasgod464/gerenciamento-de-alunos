import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { ChartPie, Save, Trash2, Plus, X } from "lucide-react";
import { useCustomFieldsData } from "./charts/useCustomFieldsData";
import { useChartData } from "./charts/useChartData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface CustomFieldsChartProps {
  savedFieldIds?: string[];
  onSave?: (fieldIds: string[]) => void;
  onRemove?: () => void;
  showSaveButton?: boolean;
  showRemoveButton?: boolean;
}

export const CustomFieldsChart = ({ 
  savedFieldIds = [],
  onSave,
  onRemove,
  showSaveButton,
  showRemoveButton 
}: CustomFieldsChartProps) => {
  const [selectedFields, setSelectedFields] = useState<string[]>(savedFieldIds);
  const { user } = useAuth();
  const { fields, students, isLoading } = useCustomFieldsData(user?.companyId);
  const chartData = useChartData(selectedFields, students, fields);

  const handleAddField = (fieldId: string) => {
    if (!selectedFields.includes(fieldId)) {
      setSelectedFields(prev => [...prev, fieldId]);
    }
  };

  const handleRemoveField = (fieldId: string) => {
    setSelectedFields(prev => prev.filter(id => id !== fieldId));
  };

  if (isLoading) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChartPie className="h-5 w-5 text-muted-foreground" />
            Distribuição por Campos Personalizados
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
            Distribuição por Campos Personalizados
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
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ChartPie className="h-5 w-5 text-muted-foreground" />
            Distribuição por Campos Personalizados
          </CardTitle>
          <div className="flex gap-2">
            {showSaveButton && selectedFields.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSave?.(selectedFields)}
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            )}
            {showRemoveButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRemove}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remover
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedFields.map((fieldId) => {
              const field = fields.find(f => f.id === fieldId);
              if (!field) return null;
              return (
                <Badge key={fieldId} variant="secondary" className="flex items-center gap-1">
                  {field.label}
                  <button 
                    onClick={() => handleRemoveField(fieldId)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
          </div>

          <div className="mb-6">
            <Select 
              value=""
              onValueChange={handleAddField}
              disabled={savedFieldIds.length > 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Adicionar campo personalizado" />
              </SelectTrigger>
              <SelectContent>
                {fields
                  .filter(field => !selectedFields.includes(field.id))
                  .map((field) => (
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
          ) : selectedFields.length > 0 ? (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              Nenhum dado disponível para os campos selecionados
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};