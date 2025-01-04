import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserStatsProps {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
}

export function UserStats({ totalUsers, activeUsers, inactiveUsers }: UserStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Usuários Inativos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{inactiveUsers}</div>
        </CardContent>
      </Card>
    </div>
  );
}