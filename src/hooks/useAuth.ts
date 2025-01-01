import { useQuery } from "@tanstack/react-query";
import { User } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const { data: session, refetch } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        return null;
      }
      if (!session) return null;

      // Fetch additional user data from our users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (userError) {
        console.error("Error fetching user data:", userError);
        return null;
      }

      return {
        user: userData,
        token: session.access_token
      };
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const login = async (email: string, password: string) => {
    console.log("Attempting login for:", email);

    try {
      const { data, error } = await supabase.rpc(
        'verify_user_login',
        { p_email: email, p_password: password }
      );

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error("Invalid credentials");
      }

      const user = data[0];

      // Sign in with Supabase Auth
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      await refetch();
      return { user, token: "authenticated" };
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Invalid credentials");
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    await refetch();
  };

  const isAuthenticated = !!session?.user?.id;
  const user = session?.user as User | undefined;

  const can = (permission: string) => {
    if (!user) return false;
    return true; // Implementar lógica de permissões posteriormente
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