import { useQuery } from "@tanstack/react-query";
import { User } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";

interface DatabaseUser {
  id: string;
  name: string;
  email: string;
  role: string;
  company_id: string | null;
  created_at: string;
  last_access: string;
  profile_picture?: string;
  status?: string;
  responsible_category?: string;
  location?: string;
  specialization?: string;
  authorized_rooms?: string[];
  tags?: string[];
}

const convertDatabaseUserToUser = (dbUser: DatabaseUser): User => {
  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    role: dbUser.role as User['role'],
    companyId: dbUser.company_id,
    createdAt: dbUser.created_at,
    lastAccess: dbUser.last_access,
    profilePicture: dbUser.profile_picture,
    status: dbUser.status,
    responsibleCategory: dbUser.responsible_category,
    location: dbUser.location,
    specialization: dbUser.specialization,
    authorizedRooms: dbUser.authorized_rooms,
    tags: dbUser.tags,
  };
};

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
        { 
          p_email: email, 
          p_password: password 
        }
      );

      if (error) {
        console.error("RPC Error:", error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error("Invalid credentials");
      }

      const user = convertDatabaseUserToUser(data[0]);

      // Sign in with Supabase Auth
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        throw signInError;
      }

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
  const user = session?.user ? convertDatabaseUserToUser(session.user as DatabaseUser) : undefined;

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