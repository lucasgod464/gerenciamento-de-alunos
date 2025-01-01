import { DashboardLayout } from "@/components/DashboardLayout";
import { CompanyList } from "@/components/companies/CompanyList";
import { CompanyStats } from "@/components/companies/CompanyStats";
import { CreateCompanyDialog } from "@/components/companies/CreateCompanyDialog";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Company } from "@/types/company";
import { useAuth } from "@/hooks/useAuth";
import { useCompanyMutations } from "./CompanyMutations";

const Companies = () => {
  const { user } = useAuth();
  const { createMutation, updateMutation, deleteMutation } = useCompanyMutations();

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      console.log('Fetching companies...', 'Current user:', user);
      
      if (!user || user.role !== 'SUPER_ADMIN') {
        console.error('User not authorized');
        throw new Error('Not authorized');
      }

      const { data, error } = await supabase
        .from('companies')
        .select(`
          id,
          name,
          document,
          users_limit,
          rooms_limit,
          status,
          created_at,
          storage_used,
          (
            SELECT count(*) 
            FROM users 
            WHERE users.company_id = companies.id
          ) as current_users,
          (
            SELECT count(*) 
            FROM rooms 
            WHERE rooms.company_id = companies.id
          ) as current_rooms
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching companies:', error);
        throw error;
      }

      console.log('Companies fetched:', data);
      
      return data.map(company => ({
        id: company.id,
        name: company.name,
        document: company.document || 'N/A',
        usersLimit: company.users_limit || 10,
        currentUsers: company.current_users || 0,
        roomsLimit: company.rooms_limit || 10,
        currentRooms: company.current_rooms || 0,
        status: company.status === 'active' ? "Ativa" : "Inativa",
        createdAt: new Date(company.created_at).toLocaleDateString(),
        publicFolderPath: `/storage/${company.id}`,
        storageUsed: company.storage_used || 0
      } as Company));
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