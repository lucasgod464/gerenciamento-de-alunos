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
  merge_identical_values?: boolean;
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

  const handleSaveChart = async (fieldIds: string[], index: number, mergeIdenticalValues: boolean) => {
    try {
      if (!user?.companyId || !fieldIds.length) {
        toast({
          title: "Erro ao salvar",
          description: "Selecione pelo menos um campo para salvar o gráfico.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("dashboard_charts")
        .insert({
          name: `Gráfico ${index + 1}`,
          field_id: fieldIds.join(','),
          company_id: user.companyId,
          merge_identical_values: mergeIdenticalValues
        });

      if (error) {
        console.error("Erro ao salvar gráfico:", error);
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar o gráfico. Tente novamente.",
          variant: "destructive",
        });
        return;
      }

      // Remove o gráfico temporário após salvar com sucesso
      setCharts(prev => prev.filter(chartIndex => chartIndex !== index));

      await refetchCharts();
      
      toast({
        title: "Gráfico salvo",
        description: "O gráfico foi salvo com sucesso e estará disponível no próximo acesso.",
      });
    } catch (error) {
      console.error("Erro ao salvar gráfico:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateChart = async (chartId: string, mergeIdenticalValues: boolean) => {
    try {
      const { error } = await supabase
        .from("dashboard_charts")
        .update({ merge_identical_values: mergeIdenticalValues })
        .eq("id", chartId);

      if (error) {
        console.error("Erro ao atualizar gráfico:", error);
        toast({
          title: "Erro ao atualizar",
          description: "Não foi possível atualizar o gráfico. Tente novamente.",
          variant: "destructive",
        });
        return;
      }

      await refetchCharts();
      
      toast({
        title: "Gráfico atualizado",
        description: "As configurações do gráfico foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao atualizar gráfico:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro inesperado. Tente novamente.",
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

      if (error) {
        console.error("Erro ao remover gráfico:", error);
        toast({
          title: "Erro ao remover",
          description: "Não foi possível remover o gráfico. Tente novamente.",
          variant: "destructive",
        });
        return;
      }

      await refetchCharts();
      
      toast({
        title: "Gráfico removido",
        description: "O gráfico foi removido com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao remover gráfico:", error);
      toast({
        title: "Erro ao remover",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {savedCharts.map((chart) => (
          <div key={chart.id} className="w-full">
            <CustomFieldsChart
              savedFieldIds={chart.field_id.split(',')}
              mergeIdenticalValues={chart.merge_identical_values}
              onSave={() => {}}
              onUpdate={(mergeIdenticalValues) => handleUpdateChart(chart.id, mergeIdenticalValues)}
              onRemove={() => handleRemoveChart(chart.id)}
              showRemoveButton
              showUpdateButton
            />
          </div>
        ))}

        {charts.map((index) => (
          <div key={index} className="w-full">
            <CustomFieldsChart
              onSave={(fieldIds, mergeIdenticalValues) => handleSaveChart(fieldIds, index, mergeIdenticalValues)}
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