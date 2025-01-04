import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Room } from "@/types/room";

export interface RoomStatsProps {
  rooms: Room[];
  activeRooms: number;
  inactiveRooms: number;
}

export const RoomStats = ({ rooms, activeRooms, inactiveRooms }: RoomStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Salas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{rooms.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Salas Ativas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeRooms}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Salas Inativas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inactiveRooms}</div>
        </CardContent>
      </Card>
    </div>
  );
};