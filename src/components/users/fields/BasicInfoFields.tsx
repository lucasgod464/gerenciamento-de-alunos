import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AccessLevel } from "@/types/user";

interface BasicInfoFieldsProps {
  defaultValues?: {
    name?: string;
    email?: string;
    password?: string;
    address?: string;
    access_level?: AccessLevel;
  };
  isEditing?: boolean;
  generateStrongPassword?: () => void;
}

export function BasicInfoFields({ defaultValues, isEditing, generateStrongPassword }: BasicInfoFieldsProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo</Label>
        <Input
          id="name"
          name="name"
          placeholder="Digite o nome completo"
          defaultValue={defaultValues?.name}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Digite o email"
          defaultValue={defaultValues?.email}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">
          {isEditing ? "Nova Senha (opcional)" : "Senha"}
        </Label>
        <div className="relative flex gap-2">
          <div className="relative flex-1">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder={isEditing ? "Digite a nova senha se desejar alterá-la" : "Digite a senha"}
              defaultValue=""
              className="pr-10"
              required={!isEditing}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500" />
              )}
            </Button>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={generateStrongPassword}
            title="Gerar senha forte"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Endereço</Label>
        <Input
          id="address"
          name="address"
          placeholder="Digite o endereço"
          defaultValue={defaultValues?.address}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="access_level">Nível de Acesso</Label>
        <Select name="access_level" defaultValue={defaultValues?.access_level || "Usuário Comum"}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o nível de acesso" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Usuário Comum">Usuário Comum</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
