import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, KeyRound } from "lucide-react";

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
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Informações da Conta</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={onEmailChange}
                className="pl-10"
                placeholder="seu@email.com"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Alterar Senha</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Senha Atual</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={onCurrentPasswordChange}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Nova Senha</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={onNewPasswordChange}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={onConfirmPasswordChange}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="w-full md:w-auto">
          Salvar Alterações
        </Button>
      </div>
    </form>
  );
};