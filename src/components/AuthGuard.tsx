import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "super-admin" | "admin" | "user";
}

export const AuthGuard = ({ children, requiredRole }: AuthGuardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("No session found, redirecting to login");
        navigate("/");
        return;
      }

      console.log("Session found:", session.user.id);

      if (requiredRole) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .maybeSingle();

        console.log("Profile lookup result:", { profile, error });

        if (error) {
          console.error("Error fetching profile:", error);
          toast({
            title: "Erro",
            description: "Falha ao verificar permissões do usuário",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        if (!profile) {
          console.error("No profile found for user:", session.user.id);
          toast({
            title: "Erro",
            description: "Perfil de usuário não encontrado. Por favor, faça login novamente.",
            variant: "destructive",
          });
          await supabase.auth.signOut();
          navigate("/");
          return;
        }

        console.log("User role:", profile.role, "Required role:", requiredRole);

        if (profile.role !== requiredRole) {
          toast({
            title: "Acesso Negado",
            description: "Você não tem permissão para acessar esta página",
            variant: "destructive",
          });
          navigate("/");
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      if (event === "SIGNED_OUT") {
        navigate("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, requiredRole, toast]);

  return <>{children}</>;
};