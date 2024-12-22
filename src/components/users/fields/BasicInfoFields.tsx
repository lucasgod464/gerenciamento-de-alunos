import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { UserFormData } from "@/schemas/userSchema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

interface BasicInfoFieldsProps {
  form: UseFormReturn<UserFormData>;
  defaultValues?: {
    name?: string;
    email?: string;
    password?: string;
    location?: string;
  };
  isEditing?: boolean;
}

export function BasicInfoFields({ form, defaultValues, isEditing }: BasicInfoFieldsProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome Completo</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Digite o nome completo" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} type="email" placeholder="Digite o email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{isEditing ? "Nova Senha (opcional)" : "Senha"}</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  {...field}
                  type={showPassword ? "text" : "password"}
                  placeholder={
                    isEditing
                      ? "Digite a nova senha se desejar alterá-la"
                      : "Digite a senha"
                  }
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Local</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Digite o local" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}