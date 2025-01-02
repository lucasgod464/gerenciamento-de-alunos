import { useQuery } from "@tanstack/react-query";
import { User, AccessLevel } from "@/types/user";
import { AuthResponse } from "@/types/auth";
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
      // First try to login with users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      console.log("User login response:", { userData, userError });

      if (userData && userData.password === password) {
        const response: AuthResponse = {
          user: {
            id: userData.id,
            name: userData.name || '',
            email: userData.email,
            role: userData.role as AccessLevel,
            companyId: userData.company_id || null,
            createdAt: userData.created_at,
            lastAccess: new Date().toISOString(),
          },
          token: `${userData.role.toLowerCase()}-token`,
        };

        localStorage.setItem("session", JSON.stringify(response));
        await refetch();
        return response;
      }

      // If no user found or password doesn't match, try emails table
      const { data: emailData, error: emailError } = await supabase
        .from('emails')
        .select('*, companies:company_id(*)')
        .eq('email', email)
        .maybeSingle();

      console.log("Email login response:", { emailData, emailError });

      if (emailData && emailData.password === password) {
        const response: AuthResponse = {
          user: {
            id: emailData.id,
            name: emailData.name || '',
            email: emailData.email,
            role: emailData.access_level as AccessLevel,
            companyId: emailData.company_id || null,
            createdAt: emailData.created_at,
            lastAccess: new Date().toISOString(),
          },
          token: `${emailData.access_level.toLowerCase()}-token`,
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