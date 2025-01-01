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

  // Buscar empresas
  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      console.log('Fetching companies...', 'Current user:', user)
      
      if (!user || user.role !== 'SUPER_ADMIN') {
        console.error('User not authorized')
        throw new Error('Not authorized')
      }

      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching companies:', error)
        throw error
      }

      console.log('Companies fetched:', data)
      
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
    enabled: !!user && user.role === 'SUPER_ADMIN'
  })

  // Criar empresa
  const createMutation = useMutation({
    mutationFn: async (newCompany: Company) => {
      console.log('Creating company:', newCompany)
      
      if (!user || user.role !== 'SUPER_ADMIN') {
        throw new Error('Not authorized')
      }

      const { data, error } = await supabase
        .from('companies')
        .insert([{
          name: newCompany.name,
          status: newCompany.status === 'Ativa' ? 'active' : 'inactive'
        }])
        .select()
        .single()

      if (error) {
        console.error('Error creating company:', error)
        throw error
      }

      console.log('Company created:', data)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      toast({
        title: "Empresa criada",
        description: "A empresa foi criada com sucesso.",
      })
    },
    onError: (error) => {
      console.error('Error in create mutation:', error)
      toast({
        title: "Erro ao criar empresa",
        description: "Ocorreu um erro ao criar a empresa. Tente novamente.",
        variant: "destructive"
      })
    }
  })

  // Atualizar empresa
  const updateMutation = useMutation({
    mutationFn: async (company: Company) => {
      console.log('Updating company:', company)
      
      if (!user || user.role !== 'SUPER_ADMIN') {
        throw new Error('Not authorized')
      }

      const { data, error } = await supabase
        .from('companies')
        .update({
          name: company.name,
          status: company.status === 'Ativa' ? 'active' : 'inactive'
        })
        .eq('id', company.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating company:', error)
        throw error
      }

      console.log('Company updated:', data)
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

  // Excluir empresa
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting company:', id)
      
      if (!user || user.role !== 'SUPER_ADMIN') {
        throw new Error('Not authorized')
      }

      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting company:', error)
        throw error
      }

      console.log('Company deleted successfully')
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

  // Calcular estatísticas
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