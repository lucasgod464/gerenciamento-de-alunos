import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface UserFormFieldsProps {
  onAuthorizedRoomsChange: (roomIds: string[]) => void;
  password?: string;
  onPasswordChange?: (password: string) => void;
  showPasswordField?: boolean;
}

export function UserFormFields({ 
  onAuthorizedRoomsChange, 
  password, 
  onPasswordChange,
  showPasswordField = true 
}: UserFormFieldsProps) {
  const [showPassword, setShowPassword] = useState(false);

  const generatePassword = () => {
    if (!onPasswordChange) return;
    
    const length = 8;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      generatedPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    onPasswordChange(generatedPassword);
  };

  return (
    <div className="space-y-4">
      <FormField
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome</FormLabel>
            <FormControl>
              <Input placeholder="Digite o nome" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="Digite o email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {showPasswordField && (
        <div className="space-y-2">
          <FormLabel htmlFor="password">Senha</FormLabel>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => onPasswordChange?.(e.target.value)}
              className="pr-10"
              placeholder="Digite a senha ou gere uma automaticamente"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500" />
              )}
            </button>
          </div>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={generatePassword}
            className="mt-2"
          >
            Gerar Senha
          </Button>
        </div>
      )}

      <FormField
        name="responsibleCategory"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Categoria Responsável</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="category1">Categoria 1</SelectItem>
                <SelectItem value="category2">Categoria 2</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Localização</FormLabel>
            <FormControl>
              <Input placeholder="Digite a localização" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="specialization"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Especialização</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma especialização" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="spec1">Especialização 1</SelectItem>
                <SelectItem value="spec2">Especialização 2</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}