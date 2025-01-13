import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { v4 as uuidv4 } from 'uuid';

export const EnrollmentFormHeader = () => {
  const [enrollmentUrl, setEnrollmentUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadCompanyUrl = async () => {
      if (!user?.companyId) return;

      try {
        const { data: company, error } = await supabase
          .from('companies')
          .select('enrollment_form_url')
          .eq('id', user.companyId)
          .single();

        if (error) throw error;

        if (company?.enrollment_form_url) {
          setEnrollmentUrl(`${window.location.origin}/enrollment/${company.enrollment_form_url}`);
        }
      } catch (error) {
        console.error("Error loading company URL:", error);
        toast.error("Não foi possível carregar a URL do formulário.");
      }
    };

    loadCompanyUrl();
  }, [user?.companyId]);

  const generateFormUrl = async () => {
    if (!user?.companyId) {
      toast.error("Empresa não encontrada.");
      return;
    }

    setIsGenerating(true);
    try {
      const uniqueUrl = uuidv4();
      
      const { error } = await supabase
        .from('companies')
        .update({ enrollment_form_url: uniqueUrl })
        .eq('id', user.companyId);

      if (error) throw error;

      setEnrollmentUrl(`${window.location.origin}/enrollment/${uniqueUrl}`);
      toast.success("Link do formulário gerado com sucesso!");
    } catch (error) {
      console.error("Error generating form URL:", error);
      toast.error("Não foi possível gerar o link do formulário.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyLink = () => {
    if (!enrollmentUrl) {
      toast.error("A URL do formulário ainda não foi configurada.");
      return;
    }

    navigator.clipboard.writeText(enrollmentUrl);
    toast.success("Link copiado para a área de transferência!");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Link do Formulário</CardTitle>
            <CardDescription>
              Compartilhe este link para receber inscrições
            </CardDescription>
          </div>
          {enrollmentUrl && (
            <Button asChild>
              <Link to={enrollmentUrl.replace(window.location.origin, '')} target="_blank">
                <ExternalLink className="mr-2 h-4 w-4" />
                Visualizar Formulário
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
          <LinkIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <code className="text-sm flex-1 break-all">
            {enrollmentUrl || "URL do formulário não configurada"}
          </code>
          {!enrollmentUrl ? (
            <Button 
              onClick={generateFormUrl} 
              disabled={isGenerating}
            >
              {isGenerating ? "Gerando..." : "Gerar Link do Formulário"}
            </Button>
          ) : (
            <Button variant="secondary" onClick={copyLink}>
              Copiar Link
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
