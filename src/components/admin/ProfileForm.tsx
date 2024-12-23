import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, LogOut } from "lucide-react";

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
  onLogout: () => void;
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
  onLogout,
}: ProfileFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={onEmailChange}
          required
          placeholder="seu@email.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="currentPassword">Senha Atual</Label>
        <Input
          id="currentPassword"
          type="password"
          value={currentPassword}
          onChange={onCurrentPasswordChange}
          required
          placeholder="Digite sua senha atual"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">Nova Senha</Label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={onNewPasswordChange}
          placeholder="Digite a nova senha (opcional)"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={onConfirmPasswordChange}
          placeholder="Confirme a nova senha"
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
          onClick={onLogout}
          className="gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </Button>
      </div>
    </form>
  );
};