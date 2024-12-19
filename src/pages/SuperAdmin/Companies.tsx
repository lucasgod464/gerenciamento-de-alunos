import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { CompanyList } from "@/components/companies/CompanyList";
import { CompanyStats } from "@/components/companies/CompanyStats";
import { CompanyHeader } from "@/components/companies/CompanyHeader";
import { CompanySearch } from "@/components/companies/CompanySearch";
import { useCompanies } from "@/hooks/useCompanies";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { Company } from "@/types/company";
import { toast } from "sonner";

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState("");
  const { isLoading, fetchCompanies, handleUpdateCompany, handleDeleteCompany, handleResetCompany } = useCompanies();

  // Usar o hook de autenticação
  useAuthRedirect();

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await fetchCompanies();
        setCompanies(data);
      } catch (error: any) {
        toast.error("Erro ao carregar empresas");
      }
    };

    loadCompanies();
  }, [fetchCompanies]);

  const handleCreateCompany = (newCompany: Company) => {
    setCompanies([newCompany, ...companies]);
  };

  const onUpdateCompany = async (updatedCompany: Company) => {
    const success = await handleUpdateCompany(updatedCompany);
    if (success) {
      setCompanies(companies.map((company) =>
        company.id === updatedCompany.id ? updatedCompany : company
      ));
    }
  };

  const onDeleteCompany = async (id: string) => {
    const success = await handleDeleteCompany(id);
    if (success) {
      setCompanies(companies.filter((company) => company.id !== id));
    }
  };

  const onResetCompany = async (id: string) => {
    const success = await handleResetCompany(id);
    if (success) {
      setCompanies(companies.map((company) =>
        company.id === id
          ? {
              ...company,
              current_users: 0,
              current_rooms: 0,
              status: "active" as const,
            }
          : company
      ));
    }
  };

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(search.toLowerCase()) ||
      company.id.includes(search) ||
      company.document.includes(search)
  );

  if (isLoading) {
    return (
      <DashboardLayout role="super-admin">
        <div className="p-6">Carregando...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="super-admin">
      <div className="space-y-6 p-6">
        <CompanyHeader onCompanyCreated={handleCreateCompany} />

        <CompanyStats
          totalCompanies={companies.length}
          totalUsers={companies.reduce((acc, company) => acc + company.current_users, 0)}
          totalRooms={companies.reduce((acc, company) => acc + company.current_rooms, 0)}
        />

        <CompanySearch value={search} onChange={setSearch} />

        <CompanyList
          companies={filteredCompanies}
          onUpdateCompany={onUpdateCompany}
          onDeleteCompany={onDeleteCompany}
          onResetCompany={onResetCompany}
        />
      </div>
    </DashboardLayout>
  );
};

export default Companies;