import { useState } from "react"
import { DashboardLayout } from "@/components/DashboardLayout"
import { Input } from "@/components/ui/input"
import { CreateCompanyDialog } from "@/components/companies/CreateCompanyDialog"
import { CompanyList } from "@/components/companies/CompanyList"
import { CompanyStats } from "@/components/companies/CompanyStats"
import { useCompanies } from "@/hooks/useCompanies"

const Companies = () => {
  const [search, setSearch] = useState("")
  const { companies, isLoading, createCompany, updateCompany, deleteCompany, resetCompany } = useCompanies()

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
          <CreateCompanyDialog onCompanyCreated={createCompany.mutate} />
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
          onUpdateCompany={updateCompany.mutate}
          onDeleteCompany={deleteCompany.mutate}
          onResetCompany={resetCompany.mutate}
        />
      </div>
    </DashboardLayout>
  )
}

export default Companies