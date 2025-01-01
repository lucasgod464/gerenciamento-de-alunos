import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Company } from "@/types/company";

export const useCompanyMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (newCompany: Partial<Company>) => {
      console.log('Creating company:', newCompany);
      
      const { data, error } = await supabase
        .from('companies')
        .insert([{
          name: newCompany.name,
          status: 'active',
          users_limit: 10,
          rooms_limit: 10
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating company:', error);
        throw error;
      }

      console.log('Company created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success("Empresa criada com sucesso!");
    },
    onError: (error) => {
      console.error('Error in create mutation:', error);
      toast.error("Erro ao criar empresa");
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (company: Company) => {
      console.log('Updating company:', company);
      
      const { data, error } = await supabase
        .from('companies')
        .update({
          name: company.name,
          status: company.status === 'Ativa' ? 'active' : 'inactive'
        })
        .eq('id', company.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating company:', error);
        throw error;
      }

      console.log('Company updated:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success("Empresa atualizada com sucesso!");
    },
    onError: (error) => {
      console.error('Error in update mutation:', error);
      toast.error("Erro ao atualizar empresa");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting company:', id);
      
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting company:', error);
        throw error;
      }

      console.log('Company deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success("Empresa excluída com sucesso!");
    },
    onError: (error) => {
      console.error('Error in delete mutation:', error);
      toast.error("Erro ao excluir empresa");
    }
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation
  };
};