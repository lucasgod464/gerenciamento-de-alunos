import { DashboardLayout } from "@/components/DashboardLayout"
import { CompanyList } from "@/components/companies/CompanyList"
import { CompanyStats } from "@/components/companies/CompanyStats"
import { CreateCompanyDialog } from "@/components/companies/CreateCompanyDialog"
import { useToast } from "@/hooks/use-toast"
import { Company } from "@/components/companies/CompanyList"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"

interface SupabaseCompany {
  id: string
  name: string
  status: string
  storage_used: number
  created_at: string
  updated_at: string
  document: string | null
  users_limit: number | null
  rooms_limit: number | null
}

const Companies = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { user } = useAuth()

  // Fetch companies
  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      console.log("Fetching companies... Current user:", user)
      const { data, error } = await supabase
        .from("companies")
        .select("*")
      
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
      
      return (data as SupabaseCompany[] || []).map(company => ({
        id: company.id,
        name: company.name,
        document: company.document || "",
        usersLimit: company.users_limit || 10,
        currentUsers: 0,
        roomsLimit: company.rooms_limit || 10,
        currentRooms: 0,
        status: company.status === "active" ? "Ativa" as const : "Inativa" as const,
        createdAt: new Date(company.created_at).toLocaleDateString(),
        publicFolderPath: `/companies/${company.id}`,
        storageUsed: company.storage_used || 0
      }))
    },
    enabled: !!user && user.role === "SUPER_ADMIN"
  })

  // Create company mutation
  const createMutation = useMutation({
    mutationFn: async (newCompany: Partial<Company>) => {
      console.log("Creating company:", newCompany)
      const { data, error } = await supabase
        .from("companies")
        .insert([{
          name: newCompany.name,
          status: newCompany.status === "Ativa" ? "active" : "inactive",
          document: newCompany.document,
          users_limit: newCompany.usersLimit,
          rooms_limit: newCompany.roomsLimit
        }])
        .select()
        .single()

      if (error) {
        console.error("Error creating company:", error)
        toast({
          title: "Erro ao criar empresa",
          description: "Ocorreu um erro ao criar a empresa. Tente novamente.",
          variant: "destructive"
        })
        throw error
      }

      const company = data as SupabaseCompany
      
      toast({
        title: "Empresa criada",
        description: "A empresa foi criada com sucesso.",
      })

      return {
        id: company.id,
        name: company.name,
        document: company.document || "",
        usersLimit: company.users_limit || 10,
        currentUsers: 0,
        roomsLimit: company.rooms_limit || 10,
        currentRooms: 0,
        status: company.status === "active" ? "Ativa" as const : "Inativa" as const,
        createdAt: new Date(company.created_at).toLocaleDateString(),
        publicFolderPath: `/companies/${company.id}`,
        storageUsed: company.storage_used || 0
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
    }
  })

  // Update company mutation
  const updateMutation = useMutation({
    mutationFn: async (company: Company) => {
      const { data, error } = await supabase
        .from("companies")
        .update({
          name: company.name,
          status: company.status === "Ativa" ? "active" : "inactive",
          users_limit: company.usersLimit,
          rooms_limit: company.roomsLimit
        })
        .eq("id", company.id)
        .select()
        .single()

      if (error) {
        toast({
          title: "Erro ao atualizar empresa",
          description: "Ocorreu um erro ao atualizar a empresa. Tente novamente.",
          variant: "destructive"
        })
        throw error
      }

      const updatedCompany = data as SupabaseCompany

      toast({
        title: "Empresa atualizada",
        description: "A empresa foi atualizada com sucesso.",
      })
      
      return {
        id: updatedCompany.id,
        name: updatedCompany.name,
        document: company.document,
        usersLimit: updatedCompany.users_limit || 10,
        currentUsers: company.currentUsers,
        roomsLimit: updatedCompany.rooms_limit || 10,
        currentRooms: company.currentRooms,
        status: updatedCompany.status === "active" ? "Ativa" as const : "Inativa" as const,
        createdAt: new Date(updatedCompany.created_at).toLocaleDateString(),
        publicFolderPath: company.publicFolderPath,
        storageUsed: updatedCompany.storage_used || 0
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("companies")
        .delete()
        .eq("id", id)

      if (error) {
        toast({
          title: "Erro ao excluir empresa",
          description: "Ocorreu um erro ao excluir a empresa. Tente novamente.",
          variant: "destructive"
        })
        throw error
      }

      toast({
        title: "Empresa excluída",
        description: "A empresa foi excluída com sucesso.",
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
    }
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
