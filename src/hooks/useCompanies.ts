import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Company } from "@/components/companies/CompanyList"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"

export function useCompanies() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      console.log("Fetching companies from Supabase")
      const { data, error } = await supabase
        .from("companies")
        .select("*")
      
      if (error) {
        console.error("Error fetching companies:", error)
        throw error
      }

      return data.map(company => ({
        ...company,
        createdAt: new Date(company.created_at).toLocaleDateString(),
      }))
    },
  })

  const createMutation = useMutation({
    mutationFn: async (newCompany: Omit<Company, "id" | "createdAt">) => {
      console.log("Creating new company:", newCompany)
      const { data, error } = await supabase
        .from("companies")
        .insert([{
          name: newCompany.name,
          document: newCompany.document,
          users_limit: newCompany.usersLimit,
          rooms_limit: newCompany.roomsLimit,
          status: newCompany.status,
          public_folder_path: newCompany.publicFolderPath,
          storage_used: 0,
        }])
        .select()
        .single()

      if (error) {
        console.error("Error creating company:", error)
        toast({
          title: "Erro ao criar empresa",
          description: "Verifique se você tem permissão para criar empresas.",
          variant: "destructive",
        })
        throw error
      }

      return {
        ...data,
        createdAt: new Date(data.created_at).toLocaleDateString(),
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
      toast({
        title: "Empresa criada",
        description: "A empresa foi criada com sucesso.",
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (updatedCompany: Company) => {
      console.log("Updating company:", updatedCompany)
      const { data, error } = await supabase
        .from("companies")
        .update({
          name: updatedCompany.name,
          users_limit: updatedCompany.usersLimit,
          rooms_limit: updatedCompany.roomsLimit,
          status: updatedCompany.status,
        })
        .eq("id", updatedCompany.id)
        .select()
        .single()

      if (error) {
        console.error("Error updating company:", error)
        toast({
          title: "Erro ao atualizar empresa",
          description: "Verifique se você tem permissão para atualizar empresas.",
          variant: "destructive",
        })
        throw error
      }

      return {
        ...data,
        createdAt: new Date(data.created_at).toLocaleDateString(),
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
      toast({
        title: "Empresa atualizada",
        description: "A empresa foi atualizada com sucesso.",
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log("Deleting company:", id)
      const { error } = await supabase
        .from("companies")
        .delete()
        .eq("id", id)

      if (error) {
        console.error("Error deleting company:", error)
        toast({
          title: "Erro ao deletar empresa",
          description: "Verifique se você tem permissão para deletar empresas.",
          variant: "destructive",
        })
        throw error
      }

      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
      toast({
        title: "Empresa deletada",
        description: "A empresa foi deletada com sucesso.",
      })
    },
  })

  const resetMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log("Resetting company:", id)
      const { data, error } = await supabase
        .from("companies")
        .update({
          current_users: 0,
          current_rooms: 0,
          status: "Ativa",
        })
        .eq("id", id)
        .select()
        .single()

      if (error) {
        console.error("Error resetting company:", error)
        toast({
          title: "Erro ao resetar empresa",
          description: "Verifique se você tem permissão para resetar empresas.",
          variant: "destructive",
        })
        throw error
      }

      return {
        ...data,
        createdAt: new Date(data.created_at).toLocaleDateString(),
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
      toast({
        title: "Empresa resetada",
        description: "A empresa foi resetada com sucesso.",
      })
    },
  })

  return {
    companies,
    isLoading,
    createCompany: createMutation.mutate,
    updateCompany: updateMutation.mutate,
    deleteCompany: deleteMutation.mutate,
    resetCompany: resetMutation.mutate,
  }
}