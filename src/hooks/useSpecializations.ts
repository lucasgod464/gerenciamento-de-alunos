import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { specializationService } from "@/services/specializations";
import { useToast } from "@/hooks/use-toast";

export function useSpecializations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: specializations = [], isLoading, error } = useQuery({
    queryKey: ['specializations'],
    queryFn: specializationService.getSpecializations,
  });

  const createMutation = useMutation({
    mutationFn: ({ name, companyId }: { name: string; companyId: string }) => 
      specializationService.createSpecialization(name, companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specializations'] });
      toast({
        title: "Especialização criada",
        description: "A especialização foi criada com sucesso.",
      });
    },
    onError: (error: Error) => {
      console.error('Error creating specialization:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a especialização.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => 
      specializationService.updateSpecialization(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specializations'] });
      toast({
        title: "Especialização atualizada",
        description: "A especialização foi atualizada com sucesso.",
      });
    },
    onError: (error: Error) => {
      console.error('Error updating specialization:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a especialização.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => specializationService.deleteSpecialization(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specializations'] });
      toast({
        title: "Especialização excluída",
        description: "A especialização foi excluída com sucesso.",
      });
    },
    onError: (error: Error) => {
      console.error('Error deleting specialization:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a especialização.",
        variant: "destructive",
      });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: boolean }) => 
      specializationService.toggleStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specializations'] });
      toast({
        title: "Status atualizado",
        description: "O status da especialização foi atualizado com sucesso.",
      });
    },
    onError: (error: Error) => {
      console.error('Error toggling specialization status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status da especialização.",
        variant: "destructive",
      });
    },
  });

  return {
    specializations,
    isLoading,
    error,
    createSpecialization: createMutation.mutate,
    updateSpecialization: updateMutation.mutate,
    deleteSpecialization: deleteMutation.mutate,
    toggleStatus: toggleStatusMutation.mutate,
  };
}