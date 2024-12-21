import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { DoorOpen } from "lucide-react";

interface Room {
  id: string;
  name: string;
  schedule: string;
  location: string;
  studyRoom: string;
  capacity: number;
  resources: string;
  status: boolean;
  companyId: string | null;
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
    console.log("All rooms from localStorage:", allRooms);
    console.log("Current user ID:", user.id);

    // Inicializa authorizedUsers como array vazio se não existir
    const authorizedRooms = allRooms.filter((room: Room) => {
      // Garante que authorizedUsers seja sempre um array
      const roomAuthorizedUsers = Array.isArray(room.authorizedUsers) 
        ? room.authorizedUsers 
        : [];

      // Verifica se o usuário está autorizado
      const isAuthorized = roomAuthorizedUsers.includes(user.id) && room.status;
      
      console.log(`Room ${room.id} - ${room.name}:`, {
        authorizedUsers: roomAuthorizedUsers,
        currentUserId: user.id,
        isAuthorized: isAuthorized,
        status: room.status
      });
      
      return isAuthorized;
    });

    console.log("Filtered authorized rooms:", authorizedRooms);
    setRooms(authorizedRooms);
  }, [user]);

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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <Card key={room.id}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DoorOpen className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">{room.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {room.location}
                </p>
                <p className="text-sm text-muted-foreground">
                  Horário: {room.schedule}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}