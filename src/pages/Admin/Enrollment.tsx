import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { EnrollmentFormBuilder } from "@/components/enrollment/EnrollmentFormBuilder";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const AdminEnrollment = () => {
  const enrollmentUrl = `${window.location.origin}/enrollment`;
  const [isLoading, setIsLoading] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(enrollmentUrl);
    toast.success("Link copiado para a área de transferência!");
  };

  const saveFormConfig = async (formFields: any) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('enrollment_form_config')
        .upsert({ 
          fields: formFields,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success("Configuração salva com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar a configuração");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFormConfig = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('enrollment_form_config')
        .select('*')
        .single();

      if (error) throw error;
      return data?.fields;
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar a configuração");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Inscrição Online</h1>
          <p className="text-muted-foreground">
            Configure o formulário de inscrição e compartilhe o link com os interessados
          </p>
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Link do Formulário</CardTitle>
                  <CardDescription>
                    Compartilhe este link para receber inscrições
                  </CardDescription>
                </div>
                <Button asChild>
                  <Link to="/enrollment" target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visualizar Formulário
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <LinkIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <code className="text-sm flex-1 break-all">{enrollmentUrl}</code>
                <Button variant="secondary" onClick={copyLink}>
                  Copiar Link
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuração do Formulário</CardTitle>
              <CardDescription>
                Personalize os campos e seções do formulário de inscrição
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EnrollmentFormBuilder 
                onSave={saveFormConfig}
                loadConfig={loadFormConfig}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminEnrollment;
