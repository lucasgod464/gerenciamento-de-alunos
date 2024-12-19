import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Company } from "@/types/company";
import { toast } from "sonner";

export function useCompanies() {
  const [isLoading, setIsLoading] = useState(true);

  const fetchCompanies = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        throw new Error("Não autorizado");
      }

      // Verificar se o usuário é super-admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.session.user.id)
        .single();

      if (!profile || profile.role !== 'super-admin') {
        throw new Error("Acesso não autorizado");
      }

      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map(company => ({
        ...company,
        status: company.status as "active" | "inactive"
      }));
    } catch (error: any) {
      console.error("Error fetching companies:", error);
      toast.error(error.message || "Erro ao carregar empresas");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCompany = async (updatedCompany: Company) => {
    try {
      const { error } = await supabase
        .from("companies")
        .update({
          name: updatedCompany.name,
          users_limit: updatedCompany.users_limit,
          rooms_limit: updatedCompany.rooms_limit,
        })
        .eq("id", updatedCompany.id);

      if (error) throw error;

      toast.success("Empresa atualizada com sucesso");
      return true;
    } catch (error: any) {
      console.error("Error updating company:", error);
      toast.error("Erro ao atualizar empresa");
      return false;
    }
  };

  const handleDeleteCompany = async (id: string) => {
    try {
      const { error } = await supabase
        .from("companies")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Empresa excluída com sucesso");
      return true;
    } catch (error: any) {
      console.error("Error deleting company:", error);
      toast.error("Erro ao excluir empresa");
      return false;
    }
  };

  const handleResetCompany = async (id: string) => {
    try {
      const { error } = await supabase
        .from("companies")
        .update({
          current_users: 0,
          current_rooms: 0,
          status: "active",
        })
        .eq("id", id);

      if (error) throw error;

      toast.success("Empresa resetada com sucesso");
      return true;
    } catch (error: any) {
      console.error("Error resetting company:", error);
      toast.error("Erro ao resetar empresa");
      return false;
    }
  };

  return {
    isLoading,
    fetchCompanies,
    handleUpdateCompany,
    handleDeleteCompany,
    handleResetCompany,
  };
}