import { Room } from "@/types/room";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { School, Users, Clock, MapPin } from "lucide-react";
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
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <School className="h-4 w-4" />
          {room.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-sm text-muted-foreground space-y-4">
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
        
        <Separator className="my-2" />
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 text-sm mb-1">
              <Users className="h-4 w-4" />
              <span className="font-medium text-xs text-foreground/70">Total de Alunos</span>
            </div>
            <div className="pl-6">
              <span className="text-sm">{getStudentsCount(room)} alunos</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm mb-1">
              <Clock className="h-4 w-4" />
              <span className="font-medium text-xs text-foreground/70">Horário</span>
            </div>
            <div className="pl-6">
              <span className="text-sm">{room.schedule}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm mb-1">
              <MapPin className="h-4 w-4" />
              <span className="font-medium text-xs text-foreground/70">Local</span>
            </div>
            <div className="pl-6">
              <span className="text-sm">{room.location}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};