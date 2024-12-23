import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";
import { useNavigate } from "react-router-dom";

interface ProfileData {
  name?: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const useProfileForm = (initialData?: { name?: string }) => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<ProfileData>({
    name: initialData?.name || "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email,
      }));
    }
  }, [user]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const { name, email, currentPassword, newPassword, confirmPassword } = formData;

    if (name !== undefined && !name.trim()) {
      toast({
        title: "Erro",
        description: "O nome é obrigatório",
        variant: "destructive",
      });
      return false;
    }

    if (!email.trim()) {
      toast({
        title: "Erro",
        description: "O email é obrigatório",
        variant: "destructive",
      });
      return false;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Erro",
        description: "Por favor, insira um email válido",
        variant: "destructive",
      });
      return false;
    }

    if (!currentPassword) {
      toast({
        title: "Erro",
        description: "A senha atual é obrigatória",
        variant: "destructive",
      });
      return false;
    }

    if (currentPassword !== "123456") {
      toast({
        title: "Erro",
        description: "Senha atual incorreta",
        variant: "destructive",
      });
      return false;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        toast({
          title: "Erro",
          description: "A nova senha deve ter pelo menos 6 caracteres",
          variant: "destructive",
        });
        return false;
      }

      if (newPassword !== confirmPassword) {
        toast({
          title: "Erro",
          description: "As senhas não coincidem",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      if (!validateForm()) {
        setIsSubmitting(false);
        return;
      }

      const session = JSON.parse(localStorage.getItem("session") || "{}");
      session.user = {
        ...session.user,
        name: formData.name,
        email: formData.email,
      };
      localStorage.setItem("session", JSON.stringify(session));

      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso",
      });

      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o perfil",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
      toast({
        title: "Desconectado",
        description: "Sessão encerrada com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao fazer logout",
        variant: "destructive",
      });
    }
  };

  return {
    formData,
    isSubmitting,
    handleInputChange,
    handleUpdateProfile,
    handleLogout,
  };
};