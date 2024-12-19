import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface Company {
  id: string;
  name: string;
  document: string;
  usersLimit: number;
  currentUsers: number;
  roomsLimit: number;
  currentRooms: number;
  status: "Ativa" | "Inativa";
  createdAt: string;
  publicFolderPath: string;
}

export const useCompanies = () => {
  const queryClient = useQueryClient();

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Erro ao carregar empresas",
          description: "Não foi possível carregar a lista de empresas.",
          variant: "destructive",
        });
        throw error;
      }

      return data.map((company): Company => ({
        id: company.id,
        name: company.name,
        document: company.document,
        usersLimit: company.users_limit,
        currentUsers: company.current_users,
        roomsLimit: company.rooms_limit,
        currentRooms: company.current_rooms,
        status: company.status === "active" ? "Ativa" : "Inativa",
        createdAt: new Date(company.created_at).toLocaleDateString("pt-BR"),
        publicFolderPath: `/storage/${company.id}`,
      }));
    },
  });

  const createCompany = useMutation({
    mutationFn: async (newCompany: Partial<Company>) => {
      const { data, error } = await supabase
        .from("companies")
        .insert([
          {
            name: newCompany.name,
            document: newCompany.document,
            users_limit: newCompany.usersLimit,
            rooms_limit: newCompany.roomsLimit,
            status: "active",
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({
        title: "Empresa criada",
        description: "A empresa foi criada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao criar empresa",
        description: "Não foi possível criar a empresa.",
        variant: "destructive",
      });
    },
  });

  const updateCompany = useMutation({
    mutationFn: async (company: Partial<Company>) => {
      const { data, error } = await supabase
        .from("companies")
        .update({
          name: company.name,
          users_limit: company.usersLimit,
          rooms_limit: company.roomsLimit,
        })
        .eq("id", company.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({
        title: "Empresa atualizada",
        description: "As informações da empresa foram atualizadas com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar empresa",
        description: "Não foi possível atualizar a empresa.",
        variant: "destructive",
      });
    },
  });

  const deleteCompany = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("companies").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({
        title: "Empresa excluída",
        description: "A empresa foi excluída permanentemente.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao excluir empresa",
        description: "Não foi possível excluir a empresa.",
        variant: "destructive",
      });
    },
  });

  const resetCompany = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("companies")
        .update({
          current_users: 0,
          current_rooms: 0,
          status: "active",
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({
        title: "Empresa resetada",
        description: "A empresa foi restaurada para as configurações padrão.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao resetar empresa",
        description: "Não foi possível resetar a empresa.",
        variant: "destructive",
      });
    },
  });

  return {
    companies,
    isLoading,
    createCompany,
    updateCompany,
    deleteCompany,
    resetCompany,
  };
};