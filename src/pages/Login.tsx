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
      // Primeiro, verificar as credenciais
      const { data: credentialsData, error: credentialsError } = await supabase
        .from("credentials")
        .select("profile_id")
        .eq("email", email.toLowerCase())
        .eq("password", password)
        .maybeSingle();

      console.log("Credentials data:", credentialsData);

      if (credentialsError) {
        console.error("Credentials error:", credentialsError);
        throw new Error("Erro ao verificar credenciais");
      }

      if (!credentialsData) {
        throw new Error("Email ou senha incorretos");
      }

      // Depois, buscar o perfil usando o profile_id das credenciais
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", credentialsData.profile_id)
        .maybeSingle();

      console.log("Profile data:", profileData);

      if (profileError) {
        console.error("Profile error:", profileError);
        throw new Error("Erro ao buscar dados do usuário");
      }

      if (!profileData) {
        throw new Error("Perfil de usuário não encontrado");
      }

      // Determinar rota baseado no papel do usuário
      let redirectPath;
      if (profileData.role === 'super-admin') {
        redirectPath = "/super-admin/dashboard";
      } else if (profileData.access_level === 'Admin') {
        redirectPath = "/admin";
      } else {
        redirectPath = "/user";
      }

      // Armazenar dados do usuário
      localStorage.setItem("user", JSON.stringify({
        id: profileData.id,
        email: profileData.email,
        role: profileData.role,
        name: profileData.name,
        company_id: profileData.company_id,
        access_level: profileData.access_level
      }));

      // Redirecionar e mostrar mensagem de sucesso
      navigate(redirectPath);
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${profileData.name || 'usuário'}!`,
      });
    } catch (error: any) {
      console.error("Erro no login:", error);
      toast({
        title: "Erro no login",
        description: error.message || "Ocorreu um erro ao fazer login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Bem-vindo
          </h1>
          <p className="text-gray-500">
            Faça login para acessar sua conta
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
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
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-500">
          <p>Email para teste: superadmin@admin.com</p>
          <p>Senha: admin123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;