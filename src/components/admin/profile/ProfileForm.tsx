import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from "lucide-react";

interface ProfileFormProps {
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCurrentPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNewPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ProfileForm = ({
  email,
  currentPassword,
  newPassword,
  confirmPassword,
  onEmailChange,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}: ProfileFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações de Conta</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={onEmailChange}
              required
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Alterar Senha</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="currentPassword" className="text-xs">Senha Atual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={onCurrentPasswordChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="newPassword" className="text-xs">Nova Senha</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={onNewPasswordChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-xs">Confirmar Nova Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={onConfirmPasswordChange}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full gap-2">
            <Save className="w-4 h-4" />
            Salvar Alterações
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};