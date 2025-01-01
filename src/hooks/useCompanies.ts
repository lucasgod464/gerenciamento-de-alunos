import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Company } from "@/components/companies/CompanyList"

// Funções auxiliares para localStorage
const getStoredCompanies = (): Company[] => {
  const stored = localStorage.getItem("companies")
  if (!stored) return []
  
  const companies = JSON.parse(stored)
  return companies.map((company: any) => ({
    ...company,
    status: company.status === "Ativa" ? "Ativa" : "Inativa",
    storageUsed: company.storageUsed || 0
  }))
}

const setStoredCompanies = (companies: Company[]) => {
  localStorage.setItem("companies", JSON.stringify(companies))
}

export function useCompanies() {
  const queryClient = useQueryClient()

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const companies = getStoredCompanies()
      
      // Calculate real-time stats
      const rooms = JSON.parse(localStorage.getItem("rooms") || "[]")
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      
      return companies.map(company => ({
        ...company,
        currentUsers: users.filter((user: any) => user.companyId === company.id).length,
        currentRooms: rooms.filter((room: any) => room.companyId === company.id).length,
      }))
    },
    staleTime: Infinity,
  })

  const createMutation = useMutation({
    mutationFn: async (newCompany: Company) => {
      const currentCompanies = getStoredCompanies()
      const updatedCompanies = [...currentCompanies, newCompany]
      setStoredCompanies(updatedCompanies)
      return newCompany
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (updatedCompany: Company) => {
      const currentCompanies = getStoredCompanies()
      const updatedCompanies = currentCompanies.map((company) =>
        company.id === updatedCompany.id ? updatedCompany : company
      )
      setStoredCompanies(updatedCompanies)
      return updatedCompany
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const currentCompanies = getStoredCompanies()
      const updatedCompanies = currentCompanies.filter((company) => company.id !== id)
      setStoredCompanies(updatedCompanies)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
    },
  })

  const resetMutation = useMutation({
    mutationFn: async (id: string) => {
      const currentCompanies = getStoredCompanies()
      const updatedCompanies = currentCompanies.map((company) =>
        company.id === id
          ? {
              ...company,
              currentUsers: 0,
              currentRooms: 0,
              status: "Ativa" as const,
            }
          : company
      )
      setStoredCompanies(updatedCompanies)
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
    resetCompany: resetMutation.mutate,
  }
}
