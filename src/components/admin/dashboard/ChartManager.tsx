import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CustomFieldsChart } from "./CustomFieldsChart";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

type SavedChart = {
  id: string;
  name: string;
  field_id: string;
  company_id: string;
};

export const ChartManager = () => {
  const [charts, setCharts] = useState<number[]>([0]);
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: savedCharts = [], refetch: refetchCharts } = useQuery({
    queryKey: ["dashboard-charts", user?.companyId],
    queryFn: async () => {
      if (!user?.companyId) return [];
      
      const { data, error } = await supabase
        .from("dashboard_charts")
        .select("*")
        .eq("company_id", user.companyId);

      if (error) {
        console.error("Erro ao carregar gráficos:", error);
        throw error;
      }

      return data as SavedChart[];
    },
  });

  const handleAddChart = () => {
    setCharts(prev => [...prev, prev.length]);
  };

  const handleSaveChart = async (fieldId: string, index: number) => {
    try {
      if (!user?.companyId || !fieldId) return;

      const { error } = await supabase
        .from("dashboard_charts")
        .insert({
          name: `Gráfico ${index + 1}`,
          field_id: fieldId,
          company_id: user.companyId
        });

      if (error) throw error;

      await refetchCharts();
      
      toast({
        title: "Gráfico salvo",
        description: "O gráfico foi salvo com sucesso e estará disponível no próximo acesso.",
      });
    } catch (error) {
      console.error("Erro ao salvar gráfico:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o gráfico. Tente novamente.",
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

      await refetchCharts();
      
      toast({
        title: "Gráfico removido",
        description: "O gráfico foi removido com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao remover gráfico:", error);
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover o gráfico. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Grid container para os gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Gráficos salvos */}
        {savedCharts.map((chart) => (
          <div key={chart.id} className="w-full">
            <CustomFieldsChart
              savedFieldId={chart.field_id}
              onSave={() => {}}
              onRemove={() => handleRemoveChart(chart.id)}
              showRemoveButton
            />
          </div>
        ))}

        {/* Gráficos temporários */}
        {charts.map((index) => (
          <div key={index} className="w-full">
            <CustomFieldsChart
              onSave={(fieldId) => handleSaveChart(fieldId, index)}
              showSaveButton
            />
          </div>
        ))}
      </div>

      <Button
        onClick={handleAddChart}
        variant="outline"
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar Novo Gráfico
      </Button>
    </div>
  );
};