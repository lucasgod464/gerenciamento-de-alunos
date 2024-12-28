import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminEnrollment = () => {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Inscrição Online</h1>
        <Card>
          <CardHeader>
            <CardTitle>Inscrição Online</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Conteúdo da aba Inscrição Online será implementado aqui.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminEnrollment;