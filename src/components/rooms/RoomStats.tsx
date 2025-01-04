import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Room } from "@/types/room";

export interface RoomStatsProps {
  rooms: Room[];
  totalRooms?: number;
  activeRooms?: number;
  totalCompanies?: number;
  totalStudents?: number;
}

export function RoomStats({ 
  rooms,
  totalRooms,
  activeRooms,
  totalCompanies,
  totalStudents 
}: RoomStatsProps) {
  // Calculate stats from rooms if not provided directly
  const calculatedTotalRooms = totalRooms ?? rooms.length;
  const calculatedActiveRooms = activeRooms ?? rooms.filter(room => room.status).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Salas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{calculatedTotalRooms}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Salas Ativas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{calculatedActiveRooms}</div>
        </CardContent>
      </Card>
      {totalCompanies !== undefined && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Empresas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompanies}</div>
          </CardContent>
        </Card>
      )}
      {totalStudents !== undefined && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}