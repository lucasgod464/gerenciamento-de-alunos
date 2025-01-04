import { Card, CardContent } from "@/components/ui/card";
import { useUserRooms } from "@/hooks/useUserRooms";
import { RoomCard } from "./RoomCard";

export function UserRooms() {
  const { rooms, isLoading } = useUserRooms();

  if (isLoading) {
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
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}