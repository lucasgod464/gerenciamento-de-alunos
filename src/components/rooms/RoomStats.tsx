import { Room } from "@/types/room";
import { Card, CardContent } from "@/components/ui/card";

interface RoomStatsProps {
  rooms: Room[];
}

export function RoomStats({ rooms }: RoomStatsProps) {
  const totalRooms = rooms.length;
  const activeRooms = rooms.filter(room => room.status).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              Total de Salas
            </h3>
            <p className="text-4xl font-bold">{totalRooms}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              Salas Ativas
            </h3>
            <p className="text-4xl font-bold">{activeRooms}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}