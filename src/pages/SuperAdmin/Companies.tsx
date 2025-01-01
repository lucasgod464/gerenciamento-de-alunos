import { DashboardLayout } from "@/components/DashboardLayout"
import { CompanyList } from "@/components/companies/CompanyList"
import { CompanyStats } from "@/components/companies/CompanyStats"
import { CreateCompanyDialog } from "@/components/companies/CreateCompanyDialog"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Company } from "@/components/companies/CompanyList"
import { useAuth } from "@/hooks/useAuth"

const Companies = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { user } = useAuth()

  // Fetch companies
  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      console.log("Fetching companies with user:", user)
      
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error("Error fetching companies:", error)
        throw error
      }
      
      console.log("Companies fetched:", data)
      
      return data.map(company => ({
        id: company.id,
        name: company.name,
        document: 'N/A',
        usersLimit: 10,
        currentUsers: 0,
        roomsLimit: 10,
        currentRooms: 0,
        status: company.status === 'active' ? "Ativa" : "Inativa",
        createdAt: new Date(company.created_at).toLocaleDateString(),
        publicFolderPath: `/storage/${company.id}`,
        storageUsed: company.storage_used || 0
      } as Company))
    },
    enabled: !!user?.id // Only fetch when user is authenticated
  })

  // Create company mutation
  const createMutation = useMutation({
    mutationFn: async (newCompany: Company) => {
      const { data, error } = await supabase
        .from('companies')
        .insert([{
          name: newCompany.name,
          status: 'active'
        }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      toast({
        title: "Empresa criada",
        description: "A empresa foi criada com sucesso.",
      })
    }
  })

  // Update company mutation
  const updateMutation = useMutation({
    mutationFn: async (company: Company) => {
      const { data, error } = await supabase
        .from('companies')
        .update({
          name: company.name,
          status: company.status === 'Ativa' ? 'active' : 'inactive'
        })
        .eq('id', company.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      toast({
        title: "Empresa atualizada",
        description: "As alterações foram salvas com sucesso.",
      })
    }
  })

  // Delete company mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      toast({
        title: "Empresa excluída",
        description: "A empresa foi excluída com sucesso.",
      })
    }
  })

  if (isLoading) {
    return <div>Carregando...</div>
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
          <CreateCompanyDialog onCompanyCreated={createMutation.mutate} />
        </div>

        <CompanyList
          companies={companies}
          onUpdateCompany={updateMutation.mutate}
          onDeleteCompany={deleteMutation.mutate}
        />
      </div>
    </DashboardLayout>
  )
}

export default Companies