import { DashboardLayout } from "@/components/DashboardLayout";
import { CompanyList } from "@/components/companies/CompanyList";
import { CompanyStats } from "@/components/companies/CompanyStats";
import { CreateCompanyDialog } from "@/components/companies/CreateCompanyDialog";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Company } from "@/types/company";
import { useAuth } from "@/hooks/useAuth";
import { useCompanyMutations } from "./CompanyMutations";
import { useToast } from "@/components/ui/use-toast";

interface CompanyWithCounts extends Company {
  current_users: number;
  current_rooms: number;
}

const Companies = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { createMutation, updateMutation, deleteMutation } = useCompanyMutations();

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      console.log('Fetching companies...', 'Current user:', user);
      
      if (!user || user.role !== 'SUPER_ADMIN') {
        console.error('User not authorized');
        throw new Error('Not authorized');
      }

      // Primeiro, buscar as empresas
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('*');

      if (companiesError) {
        console.error('Error fetching companies:', companiesError);
        toast({
          title: "Erro ao carregar empresas",
          description: "Não foi possível carregar a lista de empresas.",
          variant: "destructive",
        });
        throw companiesError;
      }

      // Para cada empresa, buscar a contagem de usuários e salas
      const companiesWithCounts = await Promise.all(companiesData.map(async (company) => {
        const { count: usersCount } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('company_id', company.id);

        const { count: roomsCount } = await supabase
          .from('rooms')
          .select('*', { count: 'exact', head: true })
          .eq('company_id', company.id);

        return {
          id: company.id,
          name: company.name,
          document: company.document || 'N/A',
          usersLimit: company.users_limit || 10,
          currentUsers: usersCount || 0,
          roomsLimit: company.rooms_limit || 10,
          currentRooms: roomsCount || 0,
          status: company.status === 'active' ? "Ativa" : "Inativa",
          createdAt: new Date(company.created_at).toLocaleDateString(),
          publicFolderPath: `/storage/${company.id}`,
          storageUsed: company.storage_used || 0
        } as Company;
      }));

      console.log('Companies fetched:', companiesWithCounts);
      return companiesWithCounts;
    },
    enabled: !!user && user.role === 'SUPER_ADMIN'
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  // Calcular estatísticas
  const activeCompanies = companies.filter(company => company.status === "Ativa").length;
  const inactiveCompanies = companies.filter(company => company.status === "Inativa").length;

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
  );
};

export default Companies;