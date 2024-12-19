import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

interface Company {
  id: string
  name: string
  document: string
  usersLimit: number
  currentUsers: number
  roomsLimit: number
  currentRooms: number
  status: "Ativa" | "Inativa"
  createdAt: string
  publicFolderPath: string
}

// Funções auxiliares para localStorage
const getStoredCompanies = (): Company[] => {
  const stored = localStorage.getItem("companies")
  return stored ? JSON.parse(stored) : []
}

const setStoredCompanies = (companies: Company[]) => {
  localStorage.setItem("companies", JSON.stringify(companies))
}

export function useCompanies() {
  const queryClient = useQueryClient()

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      return getStoredCompanies()
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
              status: "Ativa",
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