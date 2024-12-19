import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

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

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([])

  const { data, isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      // For now, we'll just return the companies from state
      // Later this can be replaced with an actual API call
      return companies
    },
  })

  const createCompany = (newCompany: Company) => {
    setCompanies((prev) => [...prev, newCompany])
  }

  const updateCompany = (updatedCompany: Company) => {
    setCompanies((prev) =>
      prev.map((company) =>
        company.id === updatedCompany.id ? updatedCompany : company
      )
    )
  }

  const deleteCompany = (id: string) => {
    setCompanies((prev) => prev.filter((company) => company.id !== id))
  }

  const resetCompany = (id: string) => {
    setCompanies((prev) =>
      prev.map((company) =>
        company.id === id
          ? {
              ...company,
              currentUsers: 0,
              currentRooms: 0,
              status: "Ativa" as const,
            }
          : company
      )
    )
  }

  return {
    companies: data || [],
    isLoading,
    createCompany,
    updateCompany,
    deleteCompany,
    resetCompany,
  }
}