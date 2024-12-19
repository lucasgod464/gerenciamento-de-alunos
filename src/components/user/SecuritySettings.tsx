import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRound, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface SecuritySettingsProps {
  formData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SecuritySettings = ({ formData, onInputChange }: SecuritySettingsProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Segurança</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Senha Atual</Label>
          <Input
            id="currentPassword"
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={onInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">Nova Senha</Label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={onInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={onInputChange}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Button variant="outline" className="w-full">
            <KeyRound className="mr-2 h-4 w-4" />
            Alterar Senha
          </Button>
          <Button variant="destructive" className="w-full" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Deslogar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};