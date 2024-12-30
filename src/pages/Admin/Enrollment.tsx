import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { EnrollmentFormBuilder } from "@/components/enrollment/EnrollmentFormBuilder";

const AdminEnrollment = () => {
  const enrollmentUrl = `${window.location.origin}/enrollment`;

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Inscrição Online</h1>
          <Button asChild>
            <Link to="/enrollment" target="_blank">
              <ExternalLink className="mr-2 h-4 w-4" />
              Abrir Formulário de Inscrição
            </Link>
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Link do Formulário</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 bg-muted p-3 rounded-md">
              <code className="text-sm flex-1">{enrollmentUrl}</code>
              <Button
                variant="secondary"
                onClick={() => {
                  navigator.clipboard.writeText(enrollmentUrl);
                  alert("Link copiado!");
                }}
              >
                Copiar Link
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configuração do Formulário</CardTitle>
          </CardHeader>
          <CardContent>
            <EnrollmentFormBuilder />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminEnrollment;