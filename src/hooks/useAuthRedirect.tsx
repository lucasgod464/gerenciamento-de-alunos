import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useAuthRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate("/");
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (error) {
          throw error;
        }

        if (!profile || profile.role !== 'super-admin') {
          toast.error("Acesso não autorizado");
          navigate("/");
        }
      } catch (error: any) {
        console.error("Error checking auth:", error);
        toast.error(error.message || "Erro ao verificar autenticação");
        navigate("/");
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        navigate("/");
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (error) {
          throw error;
        }

        if (!profile || profile.role !== 'super-admin') {
          toast.error("Acesso não autorizado");
          navigate("/");
        }
      } catch (error: any) {
        console.error("Error checking auth:", error);
        toast.error(error.message || "Erro ao verificar autenticação");
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);
}