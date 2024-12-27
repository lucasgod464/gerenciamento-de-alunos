import { DashboardLayout } from "@/components/DashboardLayout"
import { CompanyList } from "@/components/companies/CompanyList"
import { CompanyStats } from "@/components/companies/CompanyStats"
import { useCompanies } from "@/hooks/useCompanies"
import { useToast } from "@/components/ui/use-toast"
import { Company } from "@/components/companies/CompanyList"

const Companies = () => {
  const { toast } = useToast()
  const {
    companies,
    isLoading,
    createCompany,
    updateCompany,
    deleteCompany,
    resetCompany,
  } = useCompanies()

  const handleCreateCompany = (newCompany: Company) => {
    createCompany(newCompany)
    toast({
      title: "Empresa criada",
      description: "A empresa foi criada com sucesso.",
    })
  }

  const totalUsers = companies.reduce(
    (acc, company) => acc + company.currentUsers,
    0
  )
  const totalRooms = companies.reduce(
    (acc, company) => acc + company.currentRooms,
    0
  )

  if (isLoading) {
    return <div>Carregando...</div>
  }

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

        <CompanyList
          companies={companies}
          onUpdateCompany={updateCompany}
          onDeleteCompany={deleteCompany}
          onResetCompany={resetCompany}
        />
      </div>
    </DashboardLayout>
  )
}

export default Companies