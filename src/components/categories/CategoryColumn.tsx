import { Room } from "@/types/room";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { School } from "lucide-react";

interface CategoryColumnProps {
  name: string;
  rooms: Room[];
}

export const CategoryColumn = ({ name, rooms }: CategoryColumnProps) => {
  return (
    <div className="flex flex-col gap-4 min-w-[300px] bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{name}</h3>
        <span className="text-sm text-muted-foreground">
          {rooms.length} {rooms.length === 1 ? 'sala' : 'salas'}
        </span>
      </div>
      
      <div className="space-y-3">
        {rooms.map((room) => (
          <Card key={room.id} className="bg-white">
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <School className="h-4 w-4" />
                {room.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
              <p>Horário: {room.schedule}</p>
              <p>Local: {room.location}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};