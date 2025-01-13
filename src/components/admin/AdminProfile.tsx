import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ProfileHeader } from "./profile/ProfileHeader";
import { ProfileForm } from "./profile/ProfileForm";
import { LogoutButton } from "./profile/LogoutButton";

export const AdminProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string>("/placeholder.svg");

  useEffect(() => {
    if (!user?.id) return;

    const session = JSON.parse(localStorage.getItem("session") || "{}");
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const currentUser = users.find((u: any) => u.id === user.id);

    if (currentUser?.email) {
      setEmail(currentUser.email);
    } else if (user.email) {
      setEmail(user.email);
    }

    if (user.profilePicture) {
      setAvatarUrl(user.profilePicture);
    }
  }, [user]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "A imagem deve ter menos de 5MB",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarUrl(result);
        
        const session = JSON.parse(localStorage.getItem("session") || "{}");
        if (session.user) {
          session.user.profilePicture = result;
          localStorage.setItem("session", JSON.stringify(session));
        }

        toast({
          title: "Sucesso",
          description: "Foto de perfil atualizada com sucesso",
        });
      };
      reader.readAsDataURL(file);
    }
  };

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

    const session = JSON.parse(localStorage.getItem("session") || "{}");
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    
    session.user = {
      ...session.user,
      email: email,
    };
    localStorage.setItem("session", JSON.stringify(session));

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

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <ProfileHeader
        name={user.name}
        avatarUrl={avatarUrl}
        onImageUpload={handleImageUpload}
      />
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
      />
      <LogoutButton />
    </div>
  );
};
