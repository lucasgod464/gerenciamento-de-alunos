import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export const EnrollmentFormHeader = () => {
  const { user } = useAuth();
  const companyId = user?.companyId;
  const enrollmentUrl = `${window.location.origin}/enrollment/${companyId}`;

  const copyLink = () => {
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
          <Button asChild>
            <Link to={`/enrollment/${companyId}`} target="_blank">
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
  );
};