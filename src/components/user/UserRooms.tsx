import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DoorOpen, Users, Calendar, MapPin } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Room {
  id: string;
  name: string;
  schedule: string;
  location: string;
  category: string;
  capacity: number;
  resources: string;
  status: boolean;
  companyId: string | null;
  students: any[];
  authorizedUsers: string[];
}

export function UserRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) {
      console.log("No user ID found");
      return;
    }

    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const currentUserData = users.find((u: any) => u.id === user.id || u.email === user.email);

    const companyRooms = allRooms.filter((room: Room) => 
      room.companyId === user.companyId && 
      room.status === true
    );

    if (currentUserData?.authorizedRooms?.length) {
      const authorizedRooms = companyRooms.filter((room: Room) =>
        currentUserData.authorizedRooms.includes(room.id)
      );
      setRooms(authorizedRooms);
    } else {
      setRooms([]);
    }
  }, [user]);

  const getStudentCount = (room: Room) => {
    return room.students?.filter(student => typeof student === 'object').length || 0;
  };

  const getCapacityPercentage = (room: Room) => {
    if (!room.capacity) return 0;
    return Math.min((getStudentCount(room) / room.capacity) * 100, 100);
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Carregando...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (rooms.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Você ainda não tem acesso a nenhuma sala.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <Card key={room.id} className="overflow-hidden">
          <CardHeader className="bg-purple-50 dark:bg-purple-900/10">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900/20">
                <DoorOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">{room.name}</CardTitle>
                {room.category && (
                  <p className="text-sm text-muted-foreground">
                    Categoria: {room.category}
                  </p>
                )}
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
                      {getStudentCount(room)} alunos
                    </span>
                    {room.capacity > 0 && (
                      <span className="text-sm text-muted-foreground">
                        Capacidade: {room.capacity}
                      </span>
                    )}
                  </div>
                  {room.capacity > 0 && (
                    <Progress 
                      value={getCapacityPercentage(room)} 
                      className="h-2"
                    />
                  )}
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
      ))}
    </div>
  );
}