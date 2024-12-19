import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/DashboardLayout"
import { Input } from "@/components/ui/input"
import { CreateCompanyDialog } from "@/components/companies/CreateCompanyDialog"
import { CompanyList } from "@/components/companies/CompanyList"
import { CompanyStats } from "@/components/companies/CompanyStats"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface Company {
  id: string
  name: string
  document: string
  users_limit: number
  current_users: number
  rooms_limit: number
  current_rooms: number
  status: string
  created_at: string
}

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCompanies(data || [])
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

  useEffect(() => {
    fetchCompanies()
  }, [])

  const handleCreateCompany = (newCompany: Company) => {
    setCompanies([newCompany, ...companies])
  }

  const handleUpdateCompany = async (updatedCompany: Company) => {
    try {
      const { error } = await supabase
        .from('companies')
        .update({
          name: updatedCompany.name,
          document: updatedCompany.document,
          users_limit: updatedCompany.users_limit,
          rooms_limit: updatedCompany.rooms_limit,
          status: updatedCompany.status,
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
          status: 'active',
        })
        .eq('id', id)

      if (error) throw error

      const updatedCompanies = companies.map((company) =>
        company.id === id
          ? {
              ...company,
              current_users: 0,
              current_rooms: 0,
              status: 'active',
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

  const totalUsers = companies.reduce((acc, company) => acc + company.current_users, 0)
  const totalRooms = companies.reduce((acc, company) => acc + company.current_rooms, 0)

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(search.toLowerCase()) ||
      company.id.includes(search) ||
      company.document.includes(search)
  )

  return (
    <DashboardLayout role="super-admin">
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Gerenciamento de Empresas</h1>
          <p className="text-muted-foreground">
            Gerencie todas as instituições de ensino cadastradas no sistema
          </p>
        </div>

        <CompanyStats
          totalCompanies={companies.length}
          totalUsers={totalUsers}
          totalRooms={totalRooms}
          isLoading={isLoading}
        />

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Lista de Empresas</h2>
          <CreateCompanyDialog onCompanyCreated={handleCreateCompany} />
        </div>

        <div className="max-w-xl">
          <Input
            placeholder="Buscar empresas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <CompanyList
          companies={filteredCompanies}
          onUpdateCompany={handleUpdateCompany}
          onDeleteCompany={handleDeleteCompany}
          onResetCompany={handleResetCompany}
          isLoading={isLoading}
        />
      </div>
    </DashboardLayout>
  )
}

export default Companies