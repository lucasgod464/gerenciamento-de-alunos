import { Room } from "@/types/room";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { School, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface CategoryColumnProps {
  name: string;
  rooms: Room[];
}

export const CategoryColumn = ({ name, rooms }: CategoryColumnProps) => {
  const { user: currentUser } = useAuth();

  const getAuthorizedUserNames = (room: Room) => {
    if (!currentUser?.companyId) return "Nenhum usuário vinculado";

    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const authorizedUsers = allUsers.filter((user: any) => 
      user.companyId === currentUser.companyId && 
      user.authorizedRooms?.includes(room.id)
    );

    if (authorizedUsers.length === 0) return "Nenhum usuário vinculado";
    return authorizedUsers.map(user => user.name).join(", ");
  };

  const getStudentsCount = (room: Room) => {
    return room.students?.length || 0;
  };

  return (
    <div className="flex flex-col gap-4 min-w-[350px] bg-gray-50 p-4 rounded-lg">
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
            <CardContent className="p-4 pt-0 text-sm text-muted-foreground space-y-2">
              <p>Horário: {room.schedule}</p>
              <p>Local: {room.location}</p>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                <span>Usuários Vinculados:</span>
              </div>
              <p className="pl-6 text-sm">{getAuthorizedUserNames(room)}</p>
              <p className="flex items-center gap-2">
                <School className="h-4 w-4" />
                <span>Total de Alunos: {getStudentsCount(room)}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};