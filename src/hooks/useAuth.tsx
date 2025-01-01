import { useEffect, useState } from "react";
import { User, AccessLevel, ROLE_PERMISSIONS, RolePermissions } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Buscar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserData(session.user.id);
      }
    });

    // Escutar mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setUser(null);
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchUserData = async (authId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authId)
      .single();

    if (error) {
      console.error('Error fetching user data:', error);
      return;
    }

    if (data) {
      setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role as AccessLevel, // Type assertion to ensure role is AccessLevel
        companyId: data.company_id,
        createdAt: data.created_at,
        lastAccess: data.last_access || '',
        profilePicture: data.profile_picture,
      });
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/login');
  };

  const can = (permission: keyof RolePermissions) => {
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
    isAuthenticated: !!user,
    logout,
    can,
    isCompanyMember,
  };
}