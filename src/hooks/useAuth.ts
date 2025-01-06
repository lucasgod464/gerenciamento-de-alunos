import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthUser, UserRole, UserStatus, mapDatabaseUser } from "@/types/auth";

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser) {
          const { data: userData, error } = await supabase
            .from('emails')
            .select('*')
            .eq('id', authUser.id)
            .single();

          if (error) throw error;

          if (userData) {
            const mappedUser: AuthUser = {
              id: userData.id,
              name: userData.name,
              email: userData.email,
              role: userData.access_level as UserRole,
              companyId: userData.company_id,
              createdAt: userData.created_at,
              lastAccess: userData.updated_at,
              status: userData.status as UserStatus,
              accessLevel: userData.access_level as UserRole,
              location: userData.location,
              specialization: userData.specialization,
              address: userData.address
            };
            setUser(mappedUser);
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: userData, error } = await supabase
          .from('emails')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error loading user data:', error);
          setUser(null);
          return;
        }

        if (userData) {
          const mappedUser: AuthUser = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.access_level as UserRole,
            companyId: userData.company_id,
            createdAt: userData.created_at,
            lastAccess: userData.updated_at,
            status: userData.status as UserStatus,
            accessLevel: userData.access_level as UserRole,
            location: userData.location,
            specialization: userData.specialization,
            address: userData.address
          };
          setUser(mappedUser);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
};