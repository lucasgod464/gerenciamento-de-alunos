import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AuthGuardProps {
  children: ReactNode;
  requiredRole: "super-admin" | "admin" | "user";
}

export const AuthGuard = ({ children, requiredRole }: AuthGuardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        console.log("No session found, redirecting to login");
        toast({
          title: "Sessão expirada",
          description: "Por favor, faça login novamente",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching user profile:", error);
          toast({
            title: "Erro",
            description: "Falha ao verificar permissões do usuário",
            variant: "destructive",
          });
          return;
        }

        if (!profile) {
          console.error("No profile found for user:", session.user.id);
          toast({
            title: "Erro",
            description: "Perfil de usuário não encontrado",
            variant: "destructive",
          });
          return;
        }

        if (profile.role !== requiredRole) {
          console.error("User does not have required role:", requiredRole);
          toast({
            title: "Acesso negado",
            description: "Você não tem permissão para acessar esta página",
            variant: "destructive",
          });
          navigate("/");
          return;
        }
      } catch (error) {
        console.error("Error in auth check:", error);
        toast({
          title: "Erro",
          description: "Falha ao verificar autenticação",
          variant: "destructive",
        });
      }
    };

    checkAuth();
  }, [navigate, requiredRole, toast]);

  return <>{children}</>;
};