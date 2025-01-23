import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { SecuritySettings } from "./SecuritySettings";

export const UserProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!user) {
    return null;
  }

  return (
    <div className="grid gap-4">
      <div className="space-y-4">
        <SecuritySettings
          formData={formData}
          onInputChange={handleInputChange}
        />
      </div>
    </div>
  );
};