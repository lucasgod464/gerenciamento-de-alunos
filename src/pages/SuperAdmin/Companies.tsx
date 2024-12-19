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
  usersLimit: number
  currentUsers: number
  roomsLimit: number
  currentRooms: number
  status: "Ativa" | "Inativa"
  createdAt: string
  publicFolderPath: string
}

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>([])
  const [search, setSearch] = useState("")
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      const formattedCompanies: Company[] = data.map((company) => ({
        id: company.id,
        name: company.name,
        document: company.document,
        usersLimit: company.users_limit,
        currentUsers: company.current_users,
        roomsLimit: company.rooms_limit,
        currentRooms: company.current_rooms,
        status: company.status === "active" ? "Ativa" : "Inativa",
        createdAt: new Date(company.created_at).toLocaleDateString("pt-BR"),
        publicFolderPath: `/storage/${company.id}`,
      }))

      setCompanies(formattedCompanies)
    } catch (error) {
      console.error("Error fetching companies:", error)
      toast({
        title: "Erro ao carregar empresas",
        description: "Não foi possível carregar a lista de empresas.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCompany = async (newCompany: Company) => {
    try {
      const { data, error } = await supabase.from("companies").insert([
        {
          name: newCompany.name,
          document: newCompany.document,
          users_limit: newCompany.usersLimit,
          rooms_limit: newCompany.roomsLimit,
          status: newCompany.status === "Ativa" ? "active" : "inactive",
        },
      ])

      if (error) throw error

      await fetchCompanies()
      toast({
        title: "Empresa criada",
        description: "A empresa foi criada com sucesso.",
      })
    } catch (error) {
      console.error("Error creating company:", error)
      toast({
        title: "Erro ao criar empresa",
        description: "Não foi possível criar a empresa.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateCompany = async (updatedCompany: Company) => {
    try {
      const { error } = await supabase
        .from("companies")
        .update({
          name: updatedCompany.name,
          users_limit: updatedCompany.usersLimit,
          rooms_limit: updatedCompany.roomsLimit,
        })
        .eq("id", updatedCompany.id)

      if (error) throw error

      await fetchCompanies()
      toast({
        title: "Empresa atualizada",
        description: "As informações da empresa foram atualizadas com sucesso.",
      })
    } catch (error) {
      console.error("Error updating company:", error)
      toast({
        title: "Erro ao atualizar empresa",
        description: "Não foi possível atualizar a empresa.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCompany = async (id: string) => {
    try {
      const { error } = await supabase.from("companies").delete().eq("id", id)

      if (error) throw error

      await fetchCompanies()
      toast({
        title: "Empresa excluída",
        description: "A empresa foi excluída permanentemente.",
      })
    } catch (error) {
      console.error("Error deleting company:", error)
      toast({
        title: "Erro ao excluir empresa",
        description: "Não foi possível excluir a empresa.",
        variant: "destructive",
      })
    }
  }

  const handleResetCompany = async (id: string) => {
    try {
      const { error } = await supabase
        .from("companies")
        .update({
          current_users: 0,
          current_rooms: 0,
          status: "active",
        })
        .eq("id", id)

      if (error) throw error

      await fetchCompanies()
      toast({
        title: "Empresa resetada",
        description: "A empresa foi restaurada para as configurações padrão.",
      })
    } catch (error) {
      console.error("Error resetting company:", error)
      toast({
        title: "Erro ao resetar empresa",
        description: "Não foi possível resetar a empresa.",
        variant: "destructive",
      })
    }
  }

  const totalUsers = companies.reduce((acc, company) => acc + company.currentUsers, 0)
  const totalRooms = companies.reduce((acc, company) => acc + company.currentRooms, 0)

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
        />
      </div>
    </DashboardLayout>
  )
}

export default Companies