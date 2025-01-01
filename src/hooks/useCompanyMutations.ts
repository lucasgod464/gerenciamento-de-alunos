import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Company } from "@/components/companies/CompanyList"
import { useToast } from "@/hooks/use-toast"

export function useCompanyMutations() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const createCompany = useMutation({
    mutationFn: async (newCompany: Partial<Company>) => {
      console.log("Creating company:", newCompany)
      const { data, error } = await supabase
        .from("companies")
        .insert([{
          name: newCompany.name,
          status: newCompany.status === "Ativa" ? "active" : "inactive",
          document: newCompany.document,
          users_limit: newCompany.usersLimit,
          rooms_limit: newCompany.roomsLimit
        }])
        .select()
        .single()

      if (error) {
        console.error("Error creating company:", error)
        toast({
          title: "Erro ao criar empresa",
          description: "Ocorreu um erro ao criar a empresa. Tente novamente.",
          variant: "destructive"
        })
        throw error
      }

      toast({
        title: "Empresa criada",
        description: "A empresa foi criada com sucesso.",
      })

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
    }
  }).mutate

  const updateCompany = useMutation({
    mutationFn: async (company: Company) => {
      const { data, error } = await supabase
        .from("companies")
        .update({
          name: company.name,
          status: company.status === "Ativa" ? "active" : "inactive",
          users_limit: company.usersLimit,
          rooms_limit: company.roomsLimit
        })
        .eq("id", company.id)
        .select()
        .single()

      if (error) {
        toast({
          title: "Erro ao atualizar empresa",
          description: "Ocorreu um erro ao atualizar a empresa. Tente novamente.",
          variant: "destructive"
        })
        throw error
      }

      toast({
        title: "Empresa atualizada",
        description: "A empresa foi atualizada com sucesso.",
      })
      
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
    }
  }).mutate

  const deleteCompany = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("companies")
        .delete()
        .eq("id", id)

      if (error) {
        toast({
          title: "Erro ao excluir empresa",
          description: "Ocorreu um erro ao excluir a empresa. Tente novamente.",
          variant: "destructive"
        })
        throw error
      }

      toast({
        title: "Empresa excluída",
        description: "A empresa foi excluída com sucesso.",
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
    }
  }).mutate

  return {
    createCompany,
    updateCompany,
    deleteCompany
  }
}