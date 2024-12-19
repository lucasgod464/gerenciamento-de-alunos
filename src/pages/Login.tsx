import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Checking initial session:", session);
      if (session) {
        handleUserSession(session);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session);
        if (event === "SIGNED_IN" && session) {
          handleUserSession(session);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleUserSession = async (session: any) => {
    try {
      console.log("Handling user session for:", session.user.id);
      
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      console.log("Profile data:", profile, "Error:", error);

      if (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Erro",
          description: "Erro ao carregar perfil do usuário",
          variant: "destructive",
        });
        return;
      }

      if (!profile) {
        console.error("No profile found");
        toast({
          title: "Erro",
          description: "Perfil de usuário não encontrado",
          variant: "destructive",
        });
        return;
      }

      console.log("User role:", profile.role);

      let redirectPath = "/user";
      switch (profile.role) {
        case "super-admin":
          redirectPath = "/super-admin/dashboard";
          break;
        case "admin":
          redirectPath = "/admin";
          break;
        case "user":
          redirectPath = "/user";
          break;
        default:
          toast({
            title: "Erro",
            description: "Tipo de usuário não reconhecido",
            variant: "destructive",
          });
          return;
      }

      console.log("Redirecting to:", redirectPath);
      navigate(redirectPath);

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao sistema.",
      });
    } catch (error) {
      console.error("Error in handleUserSession:", error);
      toast({
        title: "Erro",
        description: "Erro ao processar login",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center">Entrar na sua conta</h1>
        
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#2563eb',
                  brandAccent: '#1d4ed8',
                }
              }
            }
          }}
          providers={[]}
          localization={{
            variables: {
              sign_in: {
                email_label: "Email",
                password_label: "Senha",
                button_label: "Entrar",
                loading_button_label: "Entrando...",
                link_text: "Já tem uma conta? Entre"
              },
              sign_up: {
                email_label: "Email",
                password_label: "Senha",
                button_label: "Cadastrar",
                loading_button_label: "Cadastrando...",
                link_text: "Não tem uma conta? Cadastre-se"
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default Login;