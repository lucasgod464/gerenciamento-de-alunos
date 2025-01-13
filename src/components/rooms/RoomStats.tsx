import { Room } from "@/types/room";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Home, Ban } from "lucide-react";

interface RoomStatsProps {
  rooms: Room[];
}

export function RoomStats({ rooms = [] }: RoomStatsProps) {
  const totalRooms = rooms?.length || 0;
  const activeRooms = rooms?.filter(room => room.status).length || 0;
  const inactiveRooms = totalRooms - activeRooms;

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex flex-col items-center space-y-1.5">
            <div className="p-2 bg-blue-100 rounded-full">
              <Home className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-base font-medium text-muted-foreground">
              Total de Salas
            </h3>
            <p className="text-3xl font-bold text-blue-600">{totalRooms}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex flex-col items-center space-y-1.5">
            <div className="p-2 bg-green-100 rounded-full">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-base font-medium text-muted-foreground">
              Salas Ativas
            </h3>
            <p className="text-3xl font-bold text-green-600">{activeRooms}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex flex-col items-center space-y-1.5">
            <div className="p-2 bg-red-100 rounded-full">
              <Ban className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-base font-medium text-muted-foreground">
              Salas Desativadas
            </h3>
            <p className="text-3xl font-bold text-red-600">{inactiveRooms}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
