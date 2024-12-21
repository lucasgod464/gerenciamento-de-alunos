import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const AdminProfile = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Função para buscar dados atualizados do usuário
  const fetchUserData = () => {
    if (!user?.id) return;

    const session = JSON.parse(localStorage.getItem("session") || "{}");
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const currentUser = users.find((u: any) => u.id === user.id);

    // Se o usuário foi excluído, fazer logout
    if (!currentUser && user.role !== "SUPER_ADMIN") {
      logout();
      window.location.href = "https://preview--gerenciamento-de-alunos.lovable.app/";
      return;
    }

    // Atualizar email se houver mudança
    if (currentUser?.email) {
      setEmail(currentUser.email);
      
      // Atualizar sessão se necessário
      if (session?.user?.email !== currentUser.email) {
        session.user = {
          ...session.user,
          email: currentUser.email,
        };
        localStorage.setItem("session", JSON.stringify(session));
      }
    } else if (user.email) {
      setEmail(user.email);
    }
  };

  useEffect(() => {
    fetchUserData();

    // Adicionar listener para mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "users" || e.key === "session") {
        fetchUserData();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Verificar atualizações a cada 30 segundos
    const interval = setInterval(fetchUserData, 30000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [user]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentPassword !== "123456") {
      toast({
        title: "Erro",
        description: "Senha atual incorreta",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    if (newPassword && newPassword.length < 6) {
      toast({
        title: "Erro",
        description: "A nova senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    // Atualizar dados no localStorage
    const session = JSON.parse(localStorage.getItem("session") || "{}");
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    
    // Atualizar sessão
    session.user = {
      ...session.user,
      email: email,
    };
    localStorage.setItem("session", JSON.stringify(session));

    // Atualizar usuário na lista de usuários se existir
    if (user?.id && user.role !== "SUPER_ADMIN") {
      const updatedUsers = users.map((u: any) => 
        u.id === user.id ? { ...u, email: email } : u
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));
    }

    toast({
      title: "Sucesso",
      description: "Perfil atualizado com sucesso",
    });

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleLogout = () => {
    logout();
    window.location.href = "https://preview--gerenciamento-de-alunos.lovable.app/";
    toast({
      title: "Desconectado",
      description: "Sessão encerrada com sucesso",
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Meu Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentPassword">Senha Atual</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button type="submit" className="gap-2">
                <Save className="w-4 h-4" />
                Salvar Alterações
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};