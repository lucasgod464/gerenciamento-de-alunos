import { useQuery } from "@tanstack/react-query";
import { User, AuthResponse } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { ROLE_PERMISSIONS } from "@/types/permissions";

export function useAuth() {
  const { data: session, refetch } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async (): Promise<AuthResponse | null> => {
      const storedSession = localStorage.getItem("session");
      if (!storedSession) return null;
      
      try {
        const parsedSession = JSON.parse(storedSession);
        if (!parsedSession?.user?.id || !parsedSession?.token) {
          localStorage.removeItem("session");
          return null;
        }
        return parsedSession;
      } catch (error) {
        localStorage.removeItem("session");
        return null;
      }
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    initialData: () => {
      const storedSession = localStorage.getItem("session");
      if (!storedSession) return null;
      try {
        return JSON.parse(storedSession);
      } catch {
        return null;
      }
    },
  });

  const login = async (email: string, password: string) => {
    console.log("Attempting login for:", email);

    try {
      // Call the verify_login function to check credentials
      const { data, error } = await supabase.rpc('verify_login', {
        p_email: email,
        p_password: password
      });

      console.log("Login response:", { data, error });

      if (error) {
        console.error("Login error:", error);
        throw new Error("Email ou senha inválidos");
      }

      if (!data || data.length === 0) {
        console.error("No user data returned");
        throw new Error("Email ou senha inválidos");
      }

      const user = data[0];
      
      // Validate required fields
      if (!user.id || !user.email || !user.role) {
        console.error("Invalid user data:", user);
        throw new Error("Dados do usuário inválidos");
      }

      const response: AuthResponse = {
        user: {
          id: user.id,
          name: user.name || '',
          email: user.email,
          role: user.role as any,
          companyId: user.company_id || null,
          createdAt: user.created_at,
          lastAccess: user.last_access,
        },
        token: `${user.role.toLowerCase()}-token`,
      };

      localStorage.setItem("session", JSON.stringify(response));
      await refetch();
      return response;
    } catch (error) {
      console.error("Login failed:", error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Erro ao fazer login");
    }
  };

  const logout = () => {
    localStorage.removeItem("session");
    refetch();
  };

  const isAuthenticated = !!session?.user?.id && !!session?.token;
  const user = session?.user;

  const can = (permission: keyof typeof ROLE_PERMISSIONS[keyof typeof ROLE_PERMISSIONS]) => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role][permission];
  };

  const isCompanyMember = (companyId: string) => {
    if (!user) return false;
    if (user.role === "SUPER_ADMIN") return true;
    return user.companyId === companyId;
  };

  return {
    user,
    isAuthenticated,
    login,
    logout,
    can,
    isCompanyMember,
  };
}