import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Company } from "@/components/companies/CompanyList"
import { toast } from "sonner"

export function useCompanies() {
  const queryClient = useQueryClient()

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const companies = JSON.parse(localStorage.getItem("companies") || "[]")
      return companies
    },
  })

  const createMutation = useMutation({
    mutationFn: async (newCompany: Omit<Company, "id" | "createdAt" | "publicFolderPath" | "currentUsers" | "currentRooms" | "storageUsed">) => {
      const companies = JSON.parse(localStorage.getItem("companies") || "[]")
      const company: Company = {
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toLocaleDateString(),
        publicFolderPath: `/storage/${Math.random().toString(36).substr(2, 9)}`,
        currentUsers: 0,
        currentRooms: 0,
        storageUsed: 0,
        ...newCompany,
      }
      localStorage.setItem("companies", JSON.stringify([...companies, company]))
      return company
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
      const companies = JSON.parse(localStorage.getItem("companies") || "[]")
      const updatedCompanies = companies.map((company: Company) =>
        company.id === updatedCompany.id ? updatedCompany : company
      )
      localStorage.setItem("companies", JSON.stringify(updatedCompanies))
      return updatedCompany
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
      const companies = JSON.parse(localStorage.getItem("companies") || "[]")
      const filteredCompanies = companies.filter((company: Company) => company.id !== id)
      localStorage.setItem("companies", JSON.stringify(filteredCompanies))
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