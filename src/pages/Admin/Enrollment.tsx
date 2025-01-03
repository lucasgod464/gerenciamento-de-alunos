import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EnrollmentFormBuilder } from "@/components/enrollment/EnrollmentFormBuilder";
import { EnrollmentFormHeader } from "@/components/enrollment/EnrollmentFormHeader";

const AdminEnrollment = () => {
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
          <EnrollmentFormHeader />

          <Card>
            <CardHeader>
              <CardTitle>Configuração do Formulário</CardTitle>
              <CardDescription>
                Personalize os campos e seções do formulário de inscrição
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EnrollmentFormBuilder showHeader={false} />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminEnrollment;