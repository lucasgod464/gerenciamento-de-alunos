import { useEffect, useState } from "react";
import { User, AccessLevel } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se há usuário na sessão
    const sessionUser = sessionStorage.getItem('user');
    if (sessionUser) {
      setUser(JSON.parse(sessionUser));
    }
  }, []);

  const logout = async () => {
    sessionStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const can = (permission: string) => {
    if (!user) return false;
    const rolePermissions = {
      'SUPER_ADMIN': ['all'],
      'ADMIN': ['manageUsers', 'manageRooms', 'manageStudies'],
      'USER': ['viewRooms', 'viewStudies']
    };
    return rolePermissions[user.role as AccessLevel]?.includes('all') || 
           rolePermissions[user.role as AccessLevel]?.includes(permission);
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