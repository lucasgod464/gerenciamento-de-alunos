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
      console.log("Fetching companies...")
      const { data, error } = await supabase
        .from('companies')
        .select(`
          id,
          name,
          document,
          users_limit,
          rooms_limit,
          status,
          storage_used,
          created_at
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error("Error fetching companies:", error)
        throw error
      }

      console.log("Companies fetched:", data)
      
      return data.map(company => ({
        id: company.id,
        name: company.name,
        document: company.document || "",
        usersLimit: company.users_limit || 5,
        currentUsers: 0, // We'll implement this count later
        roomsLimit: company.rooms_limit || 5,
        currentRooms: 0, // We'll implement this count later
        status: company.status === "active" ? "Ativa" : "Inativa",
        createdAt: new Date(company.created_at).toLocaleDateString(),
        publicFolderPath: `/storage/${company.id}`,
        storageUsed: company.storage_used || 0,
      }))
    },
  })

  const createMutation = useMutation({
    mutationFn: async (newCompany: Omit<Company, "id" | "createdAt" | "storageUsed">) => {
      console.log("Creating company:", newCompany)
      const { data, error } = await supabase
        .from('companies')
        .insert([{
          name: newCompany.name,
          document: newCompany.document,
          users_limit: newCompany.usersLimit,
          rooms_limit: newCompany.roomsLimit,
          status: newCompany.status === "Ativa" ? "active" : "inactive"
        }])
        .select()
        .single()

      if (error) {
        console.error("Error creating company:", error)
        throw error
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
      toast({
        title: "Empresa criada",
        description: "A empresa foi criada com sucesso.",
      })
    },
    onError: (error) => {
      console.error("Error in create mutation:", error)
      toast({
        title: "Erro ao criar empresa",
        description: "Ocorreu um erro ao criar a empresa. Tente novamente.",
        variant: "destructive",
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (updatedCompany: Company) => {
      const { data, error } = await supabase
        .from('companies')
        .update({
          name: updatedCompany.name,
          users_limit: updatedCompany.usersLimit,
          rooms_limit: updatedCompany.roomsLimit,
          status: updatedCompany.status === "Ativa" ? "active" : "inactive"
        })
        .eq('id', updatedCompany.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
      toast({
        title: "Empresa atualizada",
        description: "As alterações foram salvas com sucesso.",
      })
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar a empresa. Tente novamente.",
        variant: "destructive",
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id)

      if (error) throw error
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
      toast({
        title: "Empresa removida",
        description: "A empresa foi removida com sucesso.",
      })
    },
    onError: () => {
      toast({
        title: "Erro ao remover",
        description: "Ocorreu um erro ao remover a empresa. Tente novamente.",
        variant: "destructive",
      })
    },
  })

  return {
    companies,
    isLoading,
    createCompany: createMutation.mutate,
    updateCompany: updateMutation.mutate,
    deleteCompany: deleteMutation.mutate,
  }
}