import { DashboardLayout } from "@/components/DashboardLayout"
import { CompanyList } from "@/components/companies/CompanyList"
import { CompanyStats } from "@/components/companies/CompanyStats"
import { CreateCompanyDialog } from "@/components/companies/CreateCompanyDialog"
import { useToast } from "@/components/ui/use-toast"
import { Company } from "@/components/companies/CompanyList"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"

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
        throw error
      }

      console.log("Companies fetched:", data)
      
      // Map database records to Company type
      return (data || []).map(company => ({
        id: company.id,
        name: company.name,
        document: "", // Default empty string for now
        usersLimit: 10, // Default value
        currentUsers: 0, // Default value
        roomsLimit: 10, // Default value
        currentRooms: 0, // Default value
        status: company.status === "active" ? "Ativa" : "Inativa",
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
          status: newCompany.status === "Ativa" ? "active" : "inactive"
        }])
        .select()
        .single()

      if (error) {
        console.error("Error creating company:", error)
        throw error
      }

      return {
        id: data.id,
        name: data.name,
        document: "",
        usersLimit: 10,
        currentUsers: 0,
        roomsLimit: 10,
        currentRooms: 0,
        status: data.status === "active" ? "Ativa" : "Inativa",
        createdAt: new Date(data.created_at).toLocaleDateString(),
        publicFolderPath: `/companies/${data.id}`,
        storageUsed: data.storage_used || 0
      }
    },
    onError: (error) => {
      console.error("Error in create mutation:", error)
      toast({
        title: "Erro ao criar empresa",
        description: "Ocorreu um erro ao criar a empresa. Tente novamente.",
        variant: "destructive"
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
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
        .from("companies")
        .update({
          name: company.name,
          status: company.status === "Ativa" ? "active" : "inactive"
        })
        .eq("id", company.id)
        .select()
        .single()

      if (error) throw error
      
      return {
        id: data.id,
        name: data.name,
        document: company.document,
        usersLimit: company.usersLimit,
        currentUsers: company.currentUsers,
        roomsLimit: company.roomsLimit,
        currentRooms: company.currentRooms,
        status: data.status === "active" ? "Ativa" : "Inativa",
        createdAt: new Date(data.created_at).toLocaleDateString(),
        publicFolderPath: company.publicFolderPath,
        storageUsed: data.storage_used || 0
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
    }
  })

  // Delete company mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("companies")
        .delete()
        .eq("id", id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
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