import { Room } from "@/types/room";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { School, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { UserWithTags } from "./UserWithTags";

interface RoomCardProps {
  room: Room;
  isSelected: boolean;
  companyId: string;
  onToggleSelection: (roomId: string) => void;
  getAuthorizedUserNames: (room: Room) => string;
  getStudentsCount: (room: Room) => number;
}

export const RoomCard = ({
  room,
  isSelected,
  companyId,
  onToggleSelection,
  getAuthorizedUserNames,
  getStudentsCount,
}: RoomCardProps) => {
  const authorizedUsers = getAuthorizedUserNames(room).split(", ");
  const hasUsers = authorizedUsers[0] !== "Nenhum usuário vinculado";

  return (
    <Card 
      className={`bg-white/90 backdrop-blur-sm hover:bg-white/95 transition-colors cursor-pointer ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={() => onToggleSelection(room.id)}
    >
      <CardHeader className="p-4">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <School className="h-4 w-4" />
            {room.name}
          </div>
          <span className="text-xs bg-white/60 px-2 py-1 rounded-full">
            {getStudentsCount(room)} alunos
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-sm text-muted-foreground space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="font-medium text-xs text-foreground/70">Horário</p>
            <p>{room.schedule}</p>
          </div>
          <div>
            <p className="font-medium text-xs text-foreground/70">Local</p>
            <p>{room.location}</p>
          </div>
        </div>
        <Separator className="my-2" />
        <div>
          <div className="flex items-center gap-2 text-sm mb-1">
            <Users className="h-4 w-4" />
            <span className="font-medium text-xs text-foreground/70">Usuários Vinculados</span>
          </div>
          <div className="pl-6 space-y-1">
            {hasUsers ? (
              authorizedUsers.map((userName, index) => (
                <UserWithTags 
                  key={index} 
                  userName={userName} 
                  companyId={companyId} 
                />
              ))
            ) : (
              <p className="text-sm">Nenhum usuário vinculado</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};