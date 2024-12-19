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

// This would be replaced with actual API calls in a real application
const mockCompanies: Company[] = []

export function useCompanies() {
  const queryClient = useQueryClient()

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      // In a real app, this would be an API call
      return mockCompanies
    },
    staleTime: Infinity, // Keep the data fresh until explicitly invalidated
  })

  const createMutation = useMutation({
    mutationFn: async (newCompany: Company) => {
      // In a real app, this would be an API call
      mockCompanies.push(newCompany)
      return newCompany
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (updatedCompany: Company) => {
      // In a real app, this would be an API call
      const index = mockCompanies.findIndex((c) => c.id === updatedCompany.id)
      if (index !== -1) {
        mockCompanies[index] = updatedCompany
      }
      return updatedCompany
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // In a real app, this would be an API call
      const index = mockCompanies.findIndex((c) => c.id === id)
      if (index !== -1) {
        mockCompanies.splice(index, 1)
      }
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
    },
  })

  const resetMutation = useMutation({
    mutationFn: async (id: string) => {
      // In a real app, this would be an API call
      const index = mockCompanies.findIndex((c) => c.id === id)
      if (index !== -1) {
        mockCompanies[index] = {
          ...mockCompanies[index],
          currentUsers: 0,
          currentRooms: 0,
          status: "Ativa",
        }
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
    resetCompany: resetMutation.mutate,
  }
}