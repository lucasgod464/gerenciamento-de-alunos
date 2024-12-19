import { useState } from "react"
import { DashboardLayout } from "@/components/DashboardLayout"
import { Input } from "@/components/ui/input"
import { CreateCompanyDialog } from "@/components/companies/CreateCompanyDialog"
import { CompanyList } from "@/components/companies/CompanyList"
import { CompanyStats } from "@/components/companies/CompanyStats"
import { useToast } from "@/components/ui/use-toast"

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

const initialCompanies: Company[] = [
  {
    id: "460027488",
    name: "Empresa Exemplo",
    document: "46.002.748/0001-14",
    usersLimit: 100,
    currentUsers: 45,
    roomsLimit: 50,
    currentRooms: 27,
    status: "Ativa",
    createdAt: "17/12/2024",
    publicFolderPath: "/storage/460027488",
  },
]

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies)
  const [search, setSearch] = useState("")
  const { toast } = useToast()

  const handleCreateCompany = (newCompany: Company) => {
    setCompanies([...companies, newCompany])
  }

  const handleUpdateCompany = (updatedCompany: Company) => {
    const updatedCompanies = companies.map((company) =>
      company.id === updatedCompany.id ? updatedCompany : company
    )
    setCompanies(updatedCompanies)
    toast({
      title: "Empresa atualizada",
      description: "As informações da empresa foram atualizadas com sucesso.",
    })
  }

  const handleDeleteCompany = (id: string) => {
    setCompanies(companies.filter((company) => company.id !== id))
    toast({
      title: "Empresa excluída",
      description: "A empresa foi excluída permanentemente.",
      variant: "destructive",
    })
  }

  const handleResetCompany = (id: string) => {
    const updatedCompanies = companies.map((company) =>
      company.id === id
        ? {
            ...company,
            currentUsers: 0,
            currentRooms: 0,
            status: "Ativa" as const,
          }
        : company
    )
    setCompanies(updatedCompanies)
    toast({
      title: "Empresa resetada",
      description: "A empresa foi restaurada para as configurações padrão.",
    })
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