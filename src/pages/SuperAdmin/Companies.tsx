import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/DashboardLayout"
import { CompanyStats } from "@/components/companies/CompanyStats"
import { CompanyList } from "@/components/companies/CompanyList"
import { CreateCompanyDialog } from "@/components/companies/CreateCompanyDialog"
import { CompanyHeader } from "@/components/companies/CompanyHeader"
import { CompanySearch } from "@/components/companies/CompanySearch"
import { useCompanies } from "@/hooks/useCompanies"
import { useAuthRedirect } from "@/hooks/useAuthRedirect"

const Companies = () => {
  const [search, setSearch] = useState("")
  const {
    companies,
    isLoading,
    fetchCompanies,
    handleCreateCompany,
    handleUpdateCompany,
    handleDeleteCompany,
    handleResetCompany,
  } = useCompanies()

  // Use o hook de autenticação
  useAuthRedirect()

  useEffect(() => {
    fetchCompanies()
  }, [])

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(search.toLowerCase()) ||
      company.id.includes(search) ||
      company.document.includes(search)
  )

  if (isLoading) {
    return (
      <DashboardLayout role="super-admin">
        <div className="p-6">Carregando...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="super-admin">
      <div className="space-y-6 p-6">
        <CompanyHeader
          title="Gerenciamento de Empresas"
          description="Gerencie todas as instituições de ensino cadastradas no sistema"
        />

        <CompanyStats
          totalCompanies={companies.length}
          totalUsers={companies.reduce((acc, company) => acc + company.current_users, 0)}
          totalRooms={companies.reduce((acc, company) => acc + company.current_rooms, 0)}
        />

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Lista de Empresas</h2>
          <CreateCompanyDialog onCompanyCreated={handleCreateCompany} />
        </div>

        <CompanySearch value={search} onChange={setSearch} />

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