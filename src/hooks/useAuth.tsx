import { useQuery } from "@tanstack/react-query";
import { AuthResponse, UserRole, AuthUser, ROLE_PERMISSIONS } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";

interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  can: (permission: keyof typeof ROLE_PERMISSIONS[UserRole]) => boolean;
  isCompanyMember: (companyId: string) => boolean;
}

export function useAuth(): UseAuthReturn {
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
      const { data: userData, error: userError } = await supabase
        .from('emails')
        .select('*')
        .eq('email', email)
        .single();

      console.log("Email login response:", { userData, userError });

      if (userData && userData.password === password) {
        const response: AuthResponse = {
          user: {
            id: userData.id,
            name: userData.name || '',
            email: userData.email,
            role: userData.access_level,
            companyId: userData.company_id,
            createdAt: userData.created_at,
            lastAccess: new Date().toISOString(),
            status: userData.status as "active" | "inactive",
            accessLevel: userData.access_level,
            location: userData.location,
            specialization: userData.specialization,
            address: userData.address,
            profilePicture: userData.profile_picture
          },
          token: `${userData.access_level.toLowerCase()}-token`
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

  const can = (permission: keyof typeof ROLE_PERMISSIONS[UserRole]) => {
    if (!session?.user) return false;
    return ROLE_PERMISSIONS[session.user.role]?.[permission] ?? false;
  };

  const isCompanyMember = (companyId: string) => {
    if (!session?.user) return false;
    if (session.user.role === "Admin") return true;
    return session.user.companyId === companyId;
  };

  return {
    user: session?.user ?? null,
    loading: false,
    login,
    logout,
    can,
    isCompanyMember,
  };
}