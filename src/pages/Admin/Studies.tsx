import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StudiesTable } from "@/components/studies/StudiesTable";
import { Study } from "@/types/study";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const Studies = () => {
  const [editingStudy, setEditingStudy] = useState<Study | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: studies = [], refetch } = useQuery({
    queryKey: ["studies", currentUser?.companyId],
    queryFn: async () => {
      if (!currentUser?.companyId) return [];

      const { data, error } = await supabase
        .from('studies')
        .select('*')
        .eq('company_id', currentUser.companyId);

      if (error) throw error;
      return data;
    },
    enabled: !!currentUser?.companyId,
  });

  const handleEdit = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('studies')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setEditingStudy(data);
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
