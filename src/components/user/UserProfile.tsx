import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileForm } from "./ProfileForm";
import { SecuritySettings } from "./SecuritySettings";
import { NotificationSettings } from "./NotificationSettings";

export const UserProfile = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [avatarUrl, setAvatarUrl] = useState<string>("/placeholder.svg");
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || ""
      }));
      if (user.profilePicture) {
        setAvatarUrl(user.profilePicture);
      }
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "A imagem deve ter menos de 5MB",
          variant: "destructive"
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
          description: "Foto de perfil atualizada com sucesso"
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const session = JSON.parse(localStorage.getItem("session") || "{}");
    if (session.user) {
      session.user = {
        ...session.user,
        name: formData.name,
        email: formData.email
      };
      localStorage.setItem("session", JSON.stringify(session));
      
      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso"
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProfileHeader
            name={user.name}
            avatarUrl={avatarUrl}
            onImageUpload={handleImageUpload}
          />
          <ProfileForm
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>

      <div className="space-y-4">
        <SecuritySettings
          formData={formData}
          onInputChange={handleInputChange}
        />
        <NotificationSettings
          notifications={notifications}
          setNotifications={setNotifications}
        />
      </div>
    </div>
  );
};