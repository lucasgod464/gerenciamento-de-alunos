import { Card, CardContent } from "@/components/ui/card";

export interface RoomStatsProps {
  totalRooms: number;
  activeRooms: number;
}

export function RoomStats({ totalRooms, activeRooms }: RoomStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-1">
            <p className="text-2xl font-bold">{totalRooms}</p>
            <p className="text-xs text-muted-foreground">
              Total de Salas
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-1">
            <p className="text-2xl font-bold">{activeRooms}</p>
            <p className="text-xs text-muted-foreground">
              Salas Ativas
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}