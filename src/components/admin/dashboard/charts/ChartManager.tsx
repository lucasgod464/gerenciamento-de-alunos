import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { CustomFieldsChart } from "../CustomFieldsChart";
import { useToast } from "@/hooks/use-toast";
import { useCompanyId } from "@/components/form-builder/hooks/useCompanyId";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface SavedChart {
  id: string;
  name: string;
  field_id: string;
}

export const ChartManager = () => {
  const { toast } = useToast();
  const companyId = useCompanyId();
  const [charts, setCharts] = useState<SavedChart[]>([]);

  // Carregar gráficos salvos
  const { data: savedCharts } = useQuery({
    queryKey: ["dashboard-charts", companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dashboard_charts")
        .select("*")
        .eq("company_id", companyId);

      if (error) throw error;
      return data as SavedChart[];
    },
  });

  // Adicionar novo gráfico
  const handleAddChart = async (fieldId: string) => {
    try {
      const { data, error } = await supabase
        .from("dashboard_charts")
        .insert([
          {
            name: "Distribuição por Campo Personalizado",
            field_id: fieldId,
            company_id: companyId,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setCharts((prev) => [...prev, data as SavedChart]);
      
      toast({
        title: "Gráfico adicionado",
        description: "O novo gráfico foi adicionado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao adicionar gráfico:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o gráfico.",
        variant: "destructive",
      });
    }
  };

  // Remover gráfico
  const handleRemoveChart = async (chartId: string) => {
    try {
      const { error } = await supabase
        .from("dashboard_charts")
        .delete()
        .eq("id", chartId);

      if (error) throw error;

      setCharts((prev) => prev.filter((chart) => chart.id !== chartId));
      
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
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Gráficos Personalizados</h2>
        <Button onClick={() => handleAddChart("")}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Gráfico
        </Button>
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
            <CustomFieldsChart />
          </div>
        ))}
      </div>
    </div>
  );
};