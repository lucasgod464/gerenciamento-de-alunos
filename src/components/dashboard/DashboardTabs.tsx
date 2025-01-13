import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardTabs() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bem-vindo ao Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Use o menu lateral para acessar as funcionalidades do sistema.
        </p>
      </CardContent>
    </Card>
  );
}
