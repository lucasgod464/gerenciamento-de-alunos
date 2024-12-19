import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Tentando login com:", email);
      
      // Primeiro, buscar o perfil
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      console.log("Resultado da busca do perfil:", profileData, profileError);

      if (profileError) {
        console.error("Erro ao buscar perfil:", profileError);
        throw new Error("Erro ao buscar usuário");
      }

      if (!profileData) {
        throw new Error("Usuário não encontrado");
      }

      // Depois, verificar as credenciais
      const { data: credentialsData, error: credentialsError } = await supabase
        .from("credentials")
        .select("*")
        .eq("email", email)
        .eq("password", password)
        .eq("profile_id", profileData.id)
        .maybeSingle();

      console.log("Resultado da busca de credenciais:", credentialsData, credentialsError);

      if (credentialsError) {
        console.error("Erro ao buscar credenciais:", credentialsError);
        throw new Error("Erro ao verificar credenciais");
      }

      if (!credentialsData) {
        throw new Error("Senha incorreta");
      }

      // Redirecionar baseado no papel do usuário
      let redirectPath;
      switch (profileData.role) {
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
          throw new Error("Tipo de usuário não reconhecido");
      }

      // Armazenar informações do usuário no localStorage
      localStorage.setItem("user", JSON.stringify({
        id: profileData.id,
        email: profileData.email,
        role: profileData.role,
        name: profileData.name,
        company_id: profileData.company_id
      }));

      navigate(redirectPath);
      
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao sistema.",
      });
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      
      toast({
        title: "Erro no login",
        description: error.message || "Email ou senha inválidos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-6 h-6 text-blue-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M11 16l-4-4m0 0l4-4m-4 4h14" 
              />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Entrar na sua conta
        </h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;