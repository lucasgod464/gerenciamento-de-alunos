import { Room } from "@/types/room";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Building2, Users, GraduationCap, Clock, MapPin } from "lucide-react";

interface RoomCardProps {
  room: Room;
  selected: boolean;
  onSelect: () => void;
}

export const RoomCard = ({
  room,
  selected,
  onSelect
}: RoomCardProps) => {
  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-all duration-200 bg-white",
        selected ? "ring-2 ring-primary ring-offset-2" : "hover:shadow-md"
      )}
      onClick={onSelect}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-purple-600" />
          <h4 className="font-medium text-sm">{room.name}</h4>
        </div>

        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-purple-600" />
          <span className="text-sm text-muted-foreground">
            Usuários Vinculados
          </span>
        </div>

        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-purple-600" />
          <span className="text-sm text-muted-foreground">
            {room.students?.length || 0} alunos
          </span>
        </div>

        {room.schedule && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-600" />
            <span className="text-sm text-muted-foreground">{room.schedule}</span>
          </div>
        )}

        {room.location && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-purple-600" />
            <span className="text-sm text-muted-foreground">{room.location}</span>
          </div>
        )}
      </div>
    </Card>
  );
};