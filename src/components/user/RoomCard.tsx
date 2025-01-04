import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DoorOpen, Users, Calendar, MapPin } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Room } from "@/types/room";

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  const getStudentCount = () => {
    return room.students?.length || 0;
  };

  const getCapacityPercentage = () => {
    const studentCount = getStudentCount();
    const estimatedCapacity = 30;
    return Math.min((studentCount / estimatedCapacity) * 100, 100);
  };

  return (
    <Card key={room.id} className="overflow-hidden">
      <CardHeader className="bg-purple-50 dark:bg-purple-900/10">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900/20">
            <DoorOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">{room.name}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">
                  {getStudentCount()} alunos
                </span>
                <span className="text-sm text-muted-foreground">
                  Capacidade estimada: 30
                </span>
              </div>
              <Progress 
                value={getCapacityPercentage()} 
                className="h-2"
              />
            </div>
          </div>

          {room.schedule && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm">{room.schedule}</span>
            </div>
          )}

          {room.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm">{room.location}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}