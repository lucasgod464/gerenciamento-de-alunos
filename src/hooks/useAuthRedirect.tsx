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
          console.log("No session found");
          navigate("/");
          return;
        }

        console.log("Session found:", session);

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        console.log("Profile data:", profile);

        if (error) {
          console.error("Profile error:", error);
          throw error;
        }

        if (!profile || profile.role !== 'super-admin') {
          console.log("Not a super-admin:", profile);
          toast.error("Acesso não autorizado");
          navigate("/");
        }
      } catch (error: any) {
        console.error("Auth check error:", error);
        toast.error(error.message || "Erro ao verificar autenticação");
        navigate("/");
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", _event, session);
      
      if (!session) {
        console.log("No session in state change");
        navigate("/");
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        console.log("Profile in state change:", profile);

        if (error) {
          console.error("Profile error in state change:", error);
          throw error;
        }

        if (!profile || profile.role !== 'super-admin') {
          console.log("Not a super-admin in state change:", profile);
          toast.error("Acesso não autorizado");
          navigate("/");
        }
      } catch (error: any) {
        console.error("Auth state change error:", error);
        toast.error(error.message || "Erro ao verificar autenticação");
        navigate("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
}