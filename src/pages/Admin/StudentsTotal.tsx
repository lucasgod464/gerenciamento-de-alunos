import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminStudentsTotal = () => {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Alunos Total</h1>
        <Card>
          <CardHeader>
            <CardTitle>Alunos Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Conteúdo da aba Alunos Total será implementado aqui.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminStudentsTotal;