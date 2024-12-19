import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Por favor, insira um email válido");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    
    // Check for super admin
    if (email === "super@teste.com" && password === "123456") {
      toast.success("Login realizado com sucesso!");
      navigate("/super-admin/dashboard");
      return;
    }

    // Check for admin
    if (email === "admin@teste.com" && password === "123456") {
      toast.success("Login realizado com sucesso!");
      navigate("/admin");
      return;
    }

    // Check for regular user
    if (email === "usuario@teste.com" && password === "123456") {
      toast.success("Login realizado com sucesso!");
      navigate("/user");
      return;
    }

    // Check for created emails (this would normally be done against a database)
    const createdEmails = JSON.parse(localStorage.getItem("createdEmails") || "[]");
    const foundEmail = createdEmails.find((e: any) => e.email === email);
    
    if (foundEmail) {
      toast.success("Login realizado com sucesso!");
      navigate(`/user?company=${foundEmail.company}`);
      return;
    }

    setError("Email ou senha inválidos");
    toast.error("Falha no login");
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
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-gray-50 p-4 rounded-md space-y-2 text-sm">
          <p className="font-semibold">Contas para teste:</p>
          <div>Super Admin: super@teste.com</div>
          <div>Admin: admin@teste.com</div>
          <div>Usuário: usuario@teste.com</div>
          <div>Senha para todas as contas: 123456</div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Senha</label>
            <Input
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;