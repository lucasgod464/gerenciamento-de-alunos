import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Company } from "@/types/company"

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchCompanies = async () => {
    try {
      const { data: session } = await supabase.auth.getSession()
      if (!session.session) {
        throw new Error("Não autorizado")
      }

      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching companies:', error)
        throw error
      }

      const typedData = (data || []).map(company => ({
        ...company,
        status: company.status as "active" | "inactive"
      }))

      setCompanies(typedData)
    } catch (error: any) {
      console.error('Error fetching companies:', error)
      toast({
        title: "Erro ao carregar empresas",
        description: error.message || "Ocorreu um erro ao carregar as empresas.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCompany = (newCompany: Company) => {
    setCompanies([newCompany, ...companies])
  }

  const handleUpdateCompany = async (updatedCompany: Company) => {
    try {
      const { error } = await supabase
        .from('companies')
        .update({
          name: updatedCompany.name,
          users_limit: updatedCompany.users_limit,
          rooms_limit: updatedCompany.rooms_limit,
        })
        .eq('id', updatedCompany.id)

      if (error) throw error

      const updatedCompanies = companies.map((company) =>
        company.id === updatedCompany.id ? updatedCompany : company
      )
      setCompanies(updatedCompanies)
      toast({
        title: "Empresa atualizada",
        description: "As informações da empresa foram atualizadas com sucesso.",
      })
    } catch (error: any) {
      console.error('Error updating company:', error)
      toast({
        title: "Erro ao atualizar empresa",
        description: error.message || "Ocorreu um erro ao atualizar a empresa.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCompany = async (id: string) => {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id)

      if (error) throw error

      setCompanies(companies.filter((company) => company.id !== id))
      toast({
        title: "Empresa excluída",
        description: "A empresa foi excluída permanentemente.",
        variant: "destructive",
      })
    } catch (error: any) {
      console.error('Error deleting company:', error)
      toast({
        title: "Erro ao excluir empresa",
        description: error.message || "Ocorreu um erro ao excluir a empresa.",
        variant: "destructive",
      })
    }
  }

  const handleResetCompany = async (id: string) => {
    try {
      const { error } = await supabase
        .from('companies')
        .update({
          current_users: 0,
          current_rooms: 0,
          status: 'active' as const,
        })
        .eq('id', id)

      if (error) throw error

      const updatedCompanies = companies.map((company) =>
        company.id === id
          ? {
              ...company,
              current_users: 0,
              current_rooms: 0,
              status: 'active' as const,
            }
          : company
      )
      setCompanies(updatedCompanies)
      toast({
        title: "Empresa resetada",
        description: "A empresa foi restaurada para as configurações padrão.",
      })
    } catch (error: any) {
      console.error('Error resetting company:', error)
      toast({
        title: "Erro ao resetar empresa",
        description: error.message || "Ocorreu um erro ao resetar a empresa.",
        variant: "destructive",
      })
    }
  }

  return {
    companies,
    isLoading,
    fetchCompanies,
    handleCreateCompany,
    handleUpdateCompany,
    handleDeleteCompany,
    handleResetCompany,
  }
}