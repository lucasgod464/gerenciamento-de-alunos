import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Company } from "@/components/companies/CompanyList"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export function useCompanies() {
  const queryClient = useQueryClient()

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      console.log("Fetching companies from Supabase...")
      const { data: companies, error } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching companies:", error)
        throw error
      }

      // Map database fields to Company type
      return companies.map((company): Company => ({
        id: company.id,
        name: company.name,
        document: company.document || "",
        usersLimit: company.users_limit || 5,
        currentUsers: 0, // We'll update this with a count query later
        roomsLimit: company.rooms_limit || 5,
        currentRooms: 0, // We'll update this with a count query later
        status: company.status === "active" ? "Ativa" : "Inativa",
        createdAt: new Date(company.created_at).toLocaleDateString(),
        publicFolderPath: `/storage/${company.id}`,
        storageUsed: company.storage_used || 0,
      }))
    },
  })

  const createMutation = useMutation({
    mutationFn: async (newCompany: Omit<Company, "id" | "createdAt" | "publicFolderPath" | "currentUsers" | "currentRooms" | "storageUsed">) => {
      console.log("Creating new company in Supabase:", newCompany)
      const { data, error } = await supabase
        .from("companies")
        .insert({
          name: newCompany.name,
          document: newCompany.document,
          users_limit: newCompany.usersLimit,
          rooms_limit: newCompany.roomsLimit,
          status: newCompany.status === "Ativa" ? "active" : "inactive",
        })
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
      toast.success("Empresa criada com sucesso!")
    },
    onError: (error) => {
      console.error("Error in createMutation:", error)
      toast.error("Erro ao criar empresa. Tente novamente.")
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (updatedCompany: Company) => {
      console.log("Updating company in Supabase:", updatedCompany)
      const { data, error } = await supabase
        .from("companies")
        .update({
          name: updatedCompany.name,
          users_limit: updatedCompany.usersLimit,
          rooms_limit: updatedCompany.roomsLimit,
          status: updatedCompany.status === "Ativa" ? "active" : "inactive",
        })
        .eq("id", updatedCompany.id)
        .select()
        .single()

      if (error) {
        console.error("Error updating company:", error)
        throw error
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
      toast.success("Empresa atualizada com sucesso!")
    },
    onError: (error) => {
      console.error("Error in updateMutation:", error)
      toast.error("Erro ao atualizar empresa. Tente novamente.")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log("Deleting company from Supabase:", id)
      const { error } = await supabase
        .from("companies")
        .delete()
        .eq("id", id)

      if (error) {
        console.error("Error deleting company:", error)
        throw error
      }

      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
      toast.success("Empresa excluída com sucesso!")
    },
    onError: (error) => {
      console.error("Error in deleteMutation:", error)
      toast.error("Erro ao excluir empresa. Tente novamente.")
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