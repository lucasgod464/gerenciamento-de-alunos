import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRound, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SecuritySettingsProps {
  formData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SecuritySettings = ({ formData, onInputChange }: SecuritySettingsProps) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleChangePassword = async () => {
    if (!user?.email) {
      toast({
        title: "Erro",
        description: "Usuário não encontrado",
        variant: "destructive",
      });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      toast({
        title: "Erro", 
        description: "A nova senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Verificar senha atual
      const { data: userData, error: verifyError } = await supabase
        .from('emails')
        .select('*')
        .eq('email', user.email)
        .eq('password', formData.currentPassword)
        .single();

      if (verifyError || !userData) {
        toast({
          title: "Erro",
          description: "Senha atual incorreta",
          variant: "destructive",
        });
        return;
      }

      // Atualizar senha
      const { error: updateError } = await supabase
        .from('emails')
        .update({ password: formData.newPassword })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast({
        title: "Sucesso",
        description: "Senha alterada com sucesso",
      });

      // Limpar formulário
      onInputChange({
        target: { name: 'currentPassword', value: '' }
      } as React.ChangeEvent<HTMLInputElement>);
      onInputChange({
        target: { name: 'newPassword', value: '' }
      } as React.ChangeEvent<HTMLInputElement>);
      onInputChange({
        target: { name: 'confirmPassword', value: '' }
      } as React.ChangeEvent<HTMLInputElement>);

    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar a senha",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleChangePassword}
            disabled={isLoading}
          >
            <KeyRound className="mr-2 h-4 w-4" />
            {isLoading ? "Alterando..." : "Alterar Senha"}
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