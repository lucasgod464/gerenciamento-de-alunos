import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface BasicInfoFieldsProps {
  defaultValues?: {
    name?: string;
    email?: string;
    password?: string;
    location?: string;
  };
  isEditing?: boolean;
}

export function BasicInfoFields({ defaultValues, isEditing }: BasicInfoFieldsProps) {
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
          {isEditing ? "Nova Senha (deixe em branco para manter a atual)" : "Senha"}
        </Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder={isEditing ? "Digite a nova senha" : "Digite a senha"}
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
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Local</Label>
        <Input
          id="location"
          name="location"
          placeholder="Digite o local"
          defaultValue={defaultValues?.location}
          required
        />
      </div>
    </>
  );
}