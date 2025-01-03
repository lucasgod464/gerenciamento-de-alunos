import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { EnrollmentFormBuilder } from "@/components/enrollment/EnrollmentFormBuilder";
import { toast } from "sonner";

const AdminEnrollment = () => {
  const enrollmentUrl = `${window.location.origin}/enrollment`;

  const copyLink = () => {
    navigator.clipboard.writeText(enrollmentUrl);
    toast.success("Link copiado para a área de transferência!");
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
              <EnrollmentFormBuilder />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminEnrollment;