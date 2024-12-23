import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, LogOut } from "lucide-react";

interface ProfileFormFieldsProps {
  showNameField?: boolean;
  formData: {
    name?: string;
    email: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  isSubmitting: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onLogout: () => void;
}

export const ProfileFormFields = ({
  showNameField = false,
  formData,
  isSubmitting,
  onInputChange,
  onSubmit,
  onLogout,
}: ProfileFormFieldsProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {showNameField && (
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={onInputChange}
            placeholder="Digite seu nome"
            required
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onInputChange}
          placeholder="Digite seu email"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="currentPassword">Senha Atual</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          value={formData.currentPassword}
          onChange={onInputChange}
          placeholder="Digite sua senha atual"
          required
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
          placeholder="Digite a nova senha (opcional)"
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
          placeholder="Confirme a nova senha"
        />
      </div>

      <div className="flex justify-between pt-4">
        <Button 
          type="submit" 
          className="gap-2"
          disabled={isSubmitting}
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? "Salvando..." : "Salvar Alterações"}
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={onLogout}
          className="gap-2"
          disabled={isSubmitting}
        >
          <LogOut className="w-4 h-4" />
          Sair
        </Button>
      </div>
    </form>
  );
};