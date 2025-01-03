import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Email } from "@/types/email";

interface EmailFormFieldsProps {
  name: string;
  email: string;
  password: string;
  accessLevel: "Admin" | "Usuário Comum";
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onAccessLevelChange: (value: "Admin" | "Usuário Comum") => void;
  onGeneratePassword?: () => void;
  showPasswordGenerator?: boolean;
  onSubmit?: (email: Omit<Email, "id" | "createdAt" | "updatedAt" | "company">) => void;
}

export function EmailFormFields({
  name,
  email,
  password,
  accessLevel,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onAccessLevelChange,
  onGeneratePassword,
  showPasswordGenerator = false,
  onSubmit,
}: EmailFormFieldsProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        name,
        email,
        password,
        accessLevel,
        companyId: "", // This will be set by the parent component
        status: "active",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <div className="flex gap-2">
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            required
          />
          {showPasswordGenerator && onGeneratePassword && (
            <button
              type="button"
              onClick={onGeneratePassword}
              className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              Gerar
            </button>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="accessLevel">Nível de Acesso</Label>
        <Select
          value={accessLevel}
          onValueChange={onAccessLevelChange}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Admin">Administrador</SelectItem>
            <SelectItem value="Usuário Comum">Usuário Comum</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit">
          Salvar
        </Button>
      </div>
    </form>
  );
}