import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { CustomFieldsChart } from "../CustomFieldsChart";
import { useToast } from "@/hooks/use-toast";
import { useCompanyId } from "@/components/form-builder/hooks/useCompanyId";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCustomFieldsData } from "./useCustomFieldsData";

interface SavedChart {
  id: string;
  name: string;
  field_id: string;
}

export const ChartManager = () => {
  const { toast } = useToast();
  const companyId = useCompanyId();
  const [selectedField, setSelectedField] = useState<string>("");
  const { fields } = useCustomFieldsData(companyId);
  const queryClient = useQueryClient();

  const { data: savedCharts = [] } = useQuery({
    queryKey: ["dashboard-charts", companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from("dashboard_charts")
        .select("*")
        .eq("company_id", companyId);

      if (error) throw error;
      return data as SavedChart[];
    },
    enabled: !!companyId
  });

  const handleAddChart = async () => {
    if (!companyId || !selectedField) {
      toast({
        title: "Erro",
        description: "Selecione um campo para adicionar o gráfico.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("dashboard_charts")
        .insert([
          {
            name: "Distribuição por Campo Personalizado",
            field_id: selectedField,
            company_id: companyId,
          },
        ]);

      if (error) throw error;
      
      await queryClient.invalidateQueries({ queryKey: ["dashboard-charts", companyId] });
      
      toast({
        title: "Gráfico adicionado",
        description: "O novo gráfico foi adicionado com sucesso.",
      });

      setSelectedField("");
    } catch (error) {
      console.error("Erro ao adicionar gráfico:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o gráfico.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveChart = async (chartId: string) => {
    try {
      const { error } = await supabase
        .from("dashboard_charts")
        .delete()
        .eq("id", chartId);

      if (error) throw error;
      
      await queryClient.invalidateQueries({ queryKey: ["dashboard-charts", companyId] });
      
      toast({
        title: "Gráfico removido",
        description: "O gráfico foi removido com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao remover gráfico:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o gráfico.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-semibold">Gráficos Personalizados</h2>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <Select value={selectedField} onValueChange={setSelectedField}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Selecione um campo" />
            </SelectTrigger>
            <SelectContent>
              {fields.map((field) => (
                <SelectItem key={field.id} value={field.id}>
                  {field.label} ({field.source === 'admin' ? 'Admin' : 'Público'})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAddChart}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Gráfico
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {savedCharts?.map((chart) => (
          <div key={chart.id} className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10"
              onClick={() => handleRemoveChart(chart.id)}
            >
              <X className="h-4 w-4" />
            </Button>
            <CustomFieldsChart selectedFieldId={chart.field_id} />
          </div>
        ))}
      </div>
    </div>
  );
};