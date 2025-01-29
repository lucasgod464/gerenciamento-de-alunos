import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Copy, Link } from "lucide-react";

export const EnrollmentFormHeader = () => {
  const [formUrl, setFormUrl] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    loadFormUrl();
  }, [user?.companyId]);

  const loadFormUrl = async () => {
    if (!user?.companyId) return;

    const { data, error } = await supabase
      .from('companies')
      .select('enrollment_form_url, enrollment_form_enabled')
      .eq('id', user.companyId)
      .maybeSingle();

    if (error) {
      console.error('Erro ao carregar URL do formulário:', error);
      return;
    }

    if (data) {
      setFormUrl(data.enrollment_form_url || '');
      setIsEnabled(data.enrollment_form_enabled || false);
    }
  };

  const generateFormUrl = async () => {
    if (!user?.companyId) {
      toast({
        title: "Erro",
        description: "Você precisa estar vinculado a uma empresa para gerar o link.",
        variant: "destructive",
      });
      return;
    }

    const uniqueUrl = crypto.randomUUID();

    const { error } = await supabase
      .from('companies')
      .update({ 
        enrollment_form_url: uniqueUrl,
        enrollment_form_enabled: true
      })
      .eq('id', user.companyId);

    if (error) {
      console.error('Erro ao gerar URL:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o link do formulário.",
        variant: "destructive",
      });
      return;
    }

    setFormUrl(uniqueUrl);
    setIsEnabled(true);
    toast({
      title: "Sucesso",
      description: "Link do formulário gerado com sucesso!",
    });
  };

  const copyToClipboard = () => {
    const url = `${window.location.origin}/enrollment/${formUrl}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copiado!",
      description: "O link do formulário foi copiado para a área de transferência.",
    });
  };

  const toggleFormStatus = async () => {
    if (!user?.companyId) return;

    const newStatus = !isEnabled;

    const { error } = await supabase
      .from('companies')
      .update({ enrollment_form_enabled: newStatus })
      .eq('id', user.companyId);

    if (error) {
      console.error('Erro ao atualizar status do formulário:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do formulário.",
        variant: "destructive",
      });
      return;
    }

    setIsEnabled(newStatus);
    toast({
      title: "Status atualizado",
      description: `Formulário ${newStatus ? 'ativado' : 'desativado'} com sucesso!`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Link do Formulário</h2>
          <p className="text-muted-foreground">
            Gere e compartilhe o link do formulário de inscrição
          </p>
        </div>
        {formUrl ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="form-status"
                checked={isEnabled}
                onCheckedChange={toggleFormStatus}
              />
              <Label htmlFor="form-status">
                {isEnabled ? "Ativado" : "Desativado"}
              </Label>
            </div>
          </div>
        ) : (
          <Button onClick={generateFormUrl}>
            <Link className="mr-2 h-4 w-4" />
            Gerar Link
          </Button>
        )}
      </div>

      {formUrl && (
        <div className="flex flex-col gap-2">
          <Label>Link do Formulário</Label>
          <div className="flex gap-2">
            <Input
              value={`${window.location.origin}/enrollment/${formUrl}`}
              readOnly
              className="bg-muted"
            />
            <Button variant="outline" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {isEnabled 
              ? "O formulário está ativo e pode receber inscrições."
              : "O formulário está desativado e não pode receber inscrições."}
          </p>
        </div>
      )}
    </div>
  );
};