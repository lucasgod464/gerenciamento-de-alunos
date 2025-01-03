import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StudiesTable } from "@/components/studies/StudiesTable";
import { Study } from "@/types/study";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Studies = () => {
  const [editingStudy, setEditingStudy] = useState<Study | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { user } = useAuth();

  const { data: studies = [], refetch } = useQuery({
    queryKey: ["studies", user?.companyId],
    queryFn: async () => {
      if (!user?.companyId) return [];

      const { data, error } = await supabase
        .from('studies')
        .select('*')
        .eq('company_id', user.companyId);

      if (error) throw error;

      return data.map(study => ({
        id: study.id,
        name: study.name,
        status: study.status,
        startDate: study.start_date,
        endDate: study.end_date
      })) as Study[];
    },
    enabled: !!user?.companyId,
  });

  const handleEdit = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('studies')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setEditingStudy({
        id: data.id,
        name: data.name,
        status: data.status,
        startDate: data.start_date,
        endDate: data.end_date
      });
      setIsEditDialogOpen(true);
    } catch (error) {
      console.error('Error fetching study:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar estudo",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6 p-6">
        <h1 className="text-2xl font-bold mb-2">Gerenciamento de Estudos</h1>
        <p className="text-muted-foreground">
          Gerencie todos os estudos cadastrados no sistema
        </p>
        <StudiesTable
          studies={studies}
          onEdit={handleEdit}
        />
      </div>
    </DashboardLayout>
  );
};

export default Studies;