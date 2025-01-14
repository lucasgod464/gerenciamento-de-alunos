import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardCheck, BarChart } from "lucide-react";
import { useUserRooms } from "@/hooks/useUserRooms";
import { RoomCard } from "@/components/user/RoomCard";

const UserDashboard = () => {
  const { rooms, isLoading } = useUserRooms();

  if (isLoading) {
    return (
      <DashboardLayout role="user">
        <div className="flex items-center justify-center h-screen">
          <p className="text-center text-muted-foreground">
            Carregando...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (rooms.length === 0) {
    return (
      <DashboardLayout role="user">
        <div className="flex items-center justify-center h-screen">
          <p className="text-center text-muted-foreground">
            Você ainda não tem acesso a nenhuma sala.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="user">
      <div className="space-y-6 p-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold mb-2">Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Bem-vindo ao seu painel de controle
          </p>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Alunos
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Alunos cadastrados
              </p>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Presenças Hoje
              </CardTitle>
              <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Alunos presentes
              </p>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Relatórios
              </CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Relatórios gerados
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
