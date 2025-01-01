import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Company } from "@/components/companies/CompanyList"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/components/ui/use-toast"

export function useCompanies() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { toast } = useToast()

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      if (!user) {
        throw new Error("User not authenticated")
      }

      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching companies:", error)
        throw error
      }

      return data.map((company: any) => ({
        id: company.id,
        name: company.name,
        document: company.document,
        usersLimit: company.users_limit,
        currentUsers: company.current_users,
        roomsLimit: company.rooms_limit,
        currentRooms: company.current_rooms,
        status: company.status,
        createdAt: new Date(company.created_at).toLocaleDateString(),
        publicFolderPath: company.public_folder_path,
        storageUsed: company.storage_used,
      }))
    },
    enabled: !!user,
  })

  const createMutation = useMutation({
    mutationFn: async (newCompany: Omit<Company, "id" | "createdAt">) => {
      if (!user) {
        throw new Error("User not authenticated")
      }

      if (user.role !== "SUPER_ADMIN") {
        throw new Error("Only SUPER_ADMIN can create companies")
      }

      const { data, error } = await supabase
        .from("companies")
        .insert([
          {
            name: newCompany.name,
            document: newCompany.document,
            users_limit: newCompany.usersLimit,
            current_users: 0,
            rooms_limit: newCompany.roomsLimit,
            current_rooms: 0,
            status: "Ativa",
            public_folder_path: newCompany.publicFolderPath,
            storage_used: 0,
          },
        ])
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
        title: "Sucesso",
        description: "Empresa criada com sucesso!",
      })
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error)
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar empresa",
        variant: "destructive",
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (updatedCompany: Company) => {
      if (!user) {
        throw new Error("User not authenticated")
      }

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
        throw error
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) {
        throw new Error("User not authenticated")
      }

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