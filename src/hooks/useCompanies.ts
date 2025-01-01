import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Company } from "@/components/companies/CompanyList";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useCompanies() {
  const queryClient = useQueryClient();

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      console.log("Fetching companies from Supabase...");
      const { data, error } = await supabase
        .from("companies")
        .select("*");

      if (error) {
        console.error("Error fetching companies:", error);
        toast.error("Erro ao carregar empresas");
        throw error;
      }

      console.log("Companies fetched:", data);
      return data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newCompany: Company) => {
      console.log("Creating company:", newCompany);
      const { data, error } = await supabase
        .from("companies")
        .insert(newCompany)
        .select()
        .single();

      if (error) {
        console.error("Error creating company:", error);
        toast.error("Erro ao criar empresa");
        throw error;
      }

      console.log("Company created:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast.success("Empresa criada com sucesso!");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedCompany: Company) => {
      console.log("Updating company:", updatedCompany);
      const { data, error } = await supabase
        .from("companies")
        .update(updatedCompany)
        .eq("id", updatedCompany.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating company:", error);
        toast.error("Erro ao atualizar empresa");
        throw error;
      }

      console.log("Company updated:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast.success("Empresa atualizada com sucesso!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log("Deleting company:", id);
      const { error } = await supabase
        .from("companies")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting company:", error);
        toast.error("Erro ao excluir empresa");
        throw error;
      }

      console.log("Company deleted successfully");
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast.success("Empresa excluída com sucesso!");
    },
  });

  return {
    companies,
    isLoading,
    createCompany: createMutation.mutate,
    updateCompany: updateMutation.mutate,
    deleteCompany: deleteMutation.mutate,
  };
}