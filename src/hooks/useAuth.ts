import { useQuery } from "@tanstack/react-query";
import { User, AuthResponse } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const { data: session, refetch } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async (): Promise<AuthResponse | null> => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session?.user?.id) {
        console.error("Session error:", error);
        return null;
      }

      // Fetch additional user data from our users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (userError) {
        console.error("User data error:", userError);
        return null;
      }

      return {
        user: {
          id: session.user.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          companyId: userData.company_id,
          createdAt: userData.created_at,
          lastAccess: userData.last_access,
        },
        token: session.access_token,
      };
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const login = async (email: string, password: string) => {
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    await refetch();
    return session;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    await refetch();
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