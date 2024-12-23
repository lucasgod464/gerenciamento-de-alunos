import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ProfileForm } from "./ProfileForm";

export const AdminProfile = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
    }
  }, [user]);

  const validateForm = () => {
    if (!email) {
      toast({
        title: "Campo obrigatório",
        description: "O email é obrigatório",
        variant: "destructive",
      });
      return false;
    }

    if (!email.includes("@")) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido",
        variant: "destructive",
      });
      return false;
    }

    if (!currentPassword) {
      toast({
        title: "Campo obrigatório",
        description: "A senha atual é obrigatória",
        variant: "destructive",
      });
      return false;
    }

    if (currentPassword !== "123456") {
      toast({
        title: "Senha incorreta",
        description: "A senha atual está incorreta",
        variant: "destructive",
      });
      return false;
    }

    if (newPassword && newPassword.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A nova senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return false;
    }

    if (newPassword && !confirmPassword) {
      toast({
        title: "Confirmação necessária",
        description: "Por favor, confirme a nova senha",
        variant: "destructive",
      });
      return false;
    }

    if (newPassword && newPassword !== confirmPassword) {
      toast({
        title: "Senhas diferentes",
        description: "A nova senha e a confirmação não coincidem",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);

      if (!validateForm()) {
        return;
      }

      const session = JSON.parse(localStorage.getItem("session") || "{}");
      session.user = {
        ...session.user,
        email: email,
      };
      localStorage.setItem("session", JSON.stringify(session));

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o perfil. Tente novamente.",
        variant: "destructive",
      });
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    try {
      logout();
      navigate("/login");
      toast({
        title: "Desconectado",
        description: "Sessão encerrada com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao fazer logout. Tente novamente.",
        variant: "destructive",
      });
      console.error("Error during logout:", error);
    }
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
          <ProfileForm
            email={email}
            currentPassword={currentPassword}
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            onEmailChange={(e) => setEmail(e.target.value)}
            onCurrentPasswordChange={(e) => setCurrentPassword(e.target.value)}
            onNewPasswordChange={(e) => setNewPassword(e.target.value)}
            onConfirmPasswordChange={(e) => setConfirmPassword(e.target.value)}
            onSubmit={handleUpdateProfile}
            onLogout={handleLogout}
          />
        </CardContent>
      </Card>
    </div>
  );
};