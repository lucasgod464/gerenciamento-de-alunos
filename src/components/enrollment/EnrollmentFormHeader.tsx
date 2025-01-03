import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export const EnrollmentFormHeader = () => {
  const enrollmentUrl = `${window.location.origin}/enrollment`;

  const copyLink = () => {
    navigator.clipboard.writeText(enrollmentUrl);
    toast.success("Link copiado para a área de transferência!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Link do Formulário</CardTitle>
        <CardDescription>
          Compartilhe este link para receber inscrições
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
          <LinkIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <code className="text-sm flex-1 break-all">{enrollmentUrl}</code>
          <div className="flex gap-2">
            <Button asChild variant="secondary">
              <Link to="/enrollment" target="_blank">
                <ExternalLink className="mr-2 h-4 w-4" />
                Visualizar Formulário
              </Link>
            </Button>
            <Button variant="secondary" onClick={copyLink}>
              Copiar Link
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};