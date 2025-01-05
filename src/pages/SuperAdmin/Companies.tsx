import { DashboardLayout } from "@/components/DashboardLayout"
import { CompanyTable } from "@/components/companies/table/CompanyTable"
import { CompanyStats } from "@/components/companies/stats/CompanyStats"
import { CreateCompanyDialog } from "@/components/companies/form/CreateCompanyDialog"
import { CompanyFilters } from "@/components/companies/filters/CompanyFilters"
import { useCompanies } from "@/hooks/useCompanies"
import { useState } from "react"
import { Company } from "@/types/company"

export default function Companies() {
  const {
    companies,
    isLoading,
    createCompany,
    updateCompany,
    deleteCompany,
  } = useCompanies()

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filtragem de empresas
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(search.toLowerCase()) ||
                         company.document.toLowerCase().includes(search.toLowerCase())
    
    const matchesStatus = statusFilter === "all" ? true :
                         statusFilter === "active" ? company.status === "Ativa" :
                         company.status === "Inativa"
    
    return matchesSearch && matchesStatus
  })

  // Cálculo de estatísticas
  const activeCompanies = companies.filter(company => company.status === "Ativa").length
  const inactiveCompanies = companies.filter(company => company.status === "Inativa").length

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
          activeCompanies={activeCompanies}
          inactiveCompanies={inactiveCompanies}
        />

        <div>
          <h2 className="text-xl font-semibold mb-4">Lista de Empresas</h2>
        </div>

        <CompanyFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        <CompanyTable
          companies={filteredCompanies}
          onUpdateCompany={updateCompany}
          onDeleteCompany={deleteCompany}
        />
      </div>
    </DashboardLayout>
  )
}