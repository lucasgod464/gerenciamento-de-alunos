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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
      <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total de Salas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-center text-gray-900">{calculatedTotalRooms}</div>
        </CardContent>
      </Card>
      <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Salas Ativas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-center text-gray-900">{calculatedActiveRooms}</div>
        </CardContent>
      </Card>
      {totalCompanies !== undefined && (
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Empresas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-center text-gray-900">{totalCompanies}</div>
          </CardContent>
        </Card>
      )}
      {totalStudents !== undefined && (
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Alunos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-center text-gray-900">{totalStudents}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}