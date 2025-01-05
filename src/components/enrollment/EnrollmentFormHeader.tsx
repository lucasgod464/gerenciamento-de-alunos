import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const EnrollmentFormHeader = () => {
  const [enrollmentUrl, setEnrollmentUrl] = useState("");
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
        toast({
          title: "Erro ao carregar URL",
          description: "Não foi possível carregar a URL do formulário.",
          variant: "destructive",
        });
      }
    };

    loadCompanyUrl();
  }, [user?.companyId]);

  const copyLink = () => {
    if (!enrollmentUrl) {
      toast({
        title: "URL não disponível",
        description: "A URL do formulário ainda não foi configurada.",
        variant: "destructive",
      });
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
              <Link to={`/enrollment/${user?.companyId}`} target="_blank">
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
          <Button variant="secondary" onClick={copyLink} disabled={!enrollmentUrl}>
            Copiar Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};