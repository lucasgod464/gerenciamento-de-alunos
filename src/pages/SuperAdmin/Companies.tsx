import { DashboardLayout } from "@/components/DashboardLayout"
import { CompanyList } from "@/components/companies/CompanyList"
import { CompanyStats } from "@/components/companies/CompanyStats"
import { CreateCompanyDialog } from "@/components/companies/CreateCompanyDialog"
import { useToast } from "@/hooks/use-toast"
import { Company } from "@/components/companies/CompanyList"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { useCompanyMutations } from "@/hooks/useCompanyMutations"

const Companies = () => {
  const { toast } = useToast()
  const { user } = useAuth()
  const { createCompany, updateCompany, deleteCompany } = useCompanyMutations()

  // Fetch companies with better error handling and logging
  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      console.log("Fetching companies... Current user:", user)
      
      if (!user) {
        console.error("No user found")
        throw new Error("User not authenticated")
      }

      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order('created_at', { ascending: false })

      if (error) {
        console.error("Error fetching companies:", error)
        toast({
          title: "Erro ao carregar empresas",
          description: "Ocorreu um erro ao carregar a lista de empresas.",
          variant: "destructive"
        })
        throw error
      }

      console.log("Companies fetched:", data)
      
      return (data || []).map(company => ({
        id: company.id,
        name: company.name,
        document: company.document || "",
        usersLimit: company.users_limit || 10,
        currentUsers: 0, // Will be calculated later
        roomsLimit: company.rooms_limit || 10,
        currentRooms: 0, // Will be calculated later
        status: company.status === "active" ? "Ativa" as const : "Inativa" as const,
        createdAt: new Date(company.created_at).toLocaleDateString(),
        publicFolderPath: `/companies/${company.id}`,
        storageUsed: company.storage_used || 0
      }))
    },
    enabled: !!user // Only run query when user is available
  })

  if (isLoading) {
    return (
      <DashboardLayout role="super-admin">
        <div className="p-6">Carregando...</div>
      </DashboardLayout>
    )
  }

  // Calculate statistics
  const activeCompanies = companies.filter(company => company.status === "Ativa").length
  const inactiveCompanies = companies.filter(company => company.status === "Inativa").length

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

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Lista de Empresas</h2>
          <CreateCompanyDialog onCompanyCreated={createCompany} />
        </div>

        <CompanyList
          companies={companies}
          onUpdateCompany={updateCompany}
          onDeleteCompany={deleteCompany}
        />
      </div>
    </DashboardLayout>
  )
}

export default Companies