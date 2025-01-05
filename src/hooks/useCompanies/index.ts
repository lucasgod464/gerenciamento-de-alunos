import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { fetchCompanies } from "./queries";
import { createCompany, updateCompany, deleteCompany } from "./mutations";
import { Company } from "@/components/companies/CompanyList";

export function useCompanies() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: fetchCompanies,
  });

  const createMutation = useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({
        title: "Empresa criada",
        description: "A empresa foi criada com sucesso.",
      });
    },
    onError: (error: Error) => {
      if (error.message !== "Empresa já existe") {
        toast({
          title: "Erro ao criar empresa",
          description: "Ocorreu um erro ao criar a empresa.",
          variant: "destructive",
        });
      }
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({
        title: "Empresa atualizada",
        description: "A empresa foi atualizada com sucesso.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({
        title: "Empresa deletada",
        description: "A empresa foi deletada com sucesso.",
      });
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