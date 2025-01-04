import { Room } from "@/types/room";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Home, Ban } from "lucide-react";

interface RoomStatsProps {
  rooms: Room[];
}

export function RoomStats({ rooms }: RoomStatsProps) {
  const totalRooms = rooms.length;
  const activeRooms = rooms.filter(room => room.status).length;
  const inactiveRooms = totalRooms - activeRooms;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 bg-blue-100 rounded-full">
              <Home className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-muted-foreground">
              Total de Salas
            </h3>
            <p className="text-4xl font-bold text-blue-600">{totalRooms}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-muted-foreground">
              Salas Ativas
            </h3>
            <p className="text-4xl font-bold text-green-600">{activeRooms}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 bg-red-100 rounded-full">
              <Ban className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-muted-foreground">
              Salas Desativadas
            </h3>
            <p className="text-4xl font-bold text-red-600">{inactiveRooms}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}