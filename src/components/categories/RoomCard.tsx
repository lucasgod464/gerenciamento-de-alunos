import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Building2, Users, GraduationCap, Clock, MapPin } from "lucide-react";
import { Room } from "@/types/room";

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
        "p-4 cursor-pointer transition-all duration-200",
        selected ? "ring-2 ring-purple-500 bg-purple-50" : "hover:bg-gray-50"
      )}
      onClick={onSelect}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-purple-600" />
          <h4 className="font-medium text-sm">{room.name}</h4>
        </div>

        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-purple-600" />
          <span className="text-sm text-muted-foreground">
            {room.students?.length || 0} {(room.students?.length || 0) === 1 ? 'aluno' : 'alunos'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-purple-600" />
          <span className="text-sm text-muted-foreground">{room.schedule}</span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-purple-600" />
          <span className="text-sm text-muted-foreground">{room.location}</span>
        </div>
      </div>
    </Card>
  );
};