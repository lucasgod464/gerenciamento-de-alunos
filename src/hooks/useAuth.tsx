import { useQuery } from "@tanstack/react-query";
import { User } from "@/types/user";
import { AuthResponse, AccessLevel } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { ROLE_PERMISSIONS } from "@/types/permissions";
import { mapDatabaseAccessLevelToAccessLevel } from "@/types/user";

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
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (userData && userData.password === password) {
        const mappedRole = mapDatabaseAccessLevelToAccessLevel(userData.access_level);
        const response: AuthResponse = {
          user: {
            id: userData.id,
            name: userData.name || '',
            email: userData.email,
            role: mappedRole,
            companyId: userData.company_id || null,
            createdAt: userData.created_at,
            lastAccess: new Date().toISOString(),
          },
          token: `${mappedRole.toLowerCase()}-token`,
        };

        localStorage.setItem("session", JSON.stringify(response));
        await refetch();
        return response;
      }

      const { data: emailData, error: emailError } = await supabase
        .from('emails')
        .select('*, companies:company_id(*)')
        .eq('email', email)
        .single();

      if (emailData && emailData.password === password) {
        const mappedRole = mapDatabaseAccessLevelToAccessLevel(emailData.access_level);
        const response: AuthResponse = {
          user: {
            id: emailData.id,
            name: emailData.name || '',
            email: emailData.email,
            role: mappedRole,
            companyId: emailData.company_id || null,
            createdAt: emailData.created_at,
            lastAccess: new Date().toISOString(),
          },
          token: `${mappedRole.toLowerCase()}-token`,
        };

        localStorage.setItem("session", JSON.stringify(response));
        await refetch();
        return response;
      }

      throw new Error("Email ou senha inválidos");
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
    if (user.role === 'SUPER_ADMIN') return true;
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