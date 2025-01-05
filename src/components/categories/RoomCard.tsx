import { Room } from "@/types/room";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RoomCardProps {
  room: Room;
  companyId: string;
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
        "p-3 cursor-pointer transition-all duration-200",
        selected ? "ring-2 ring-primary ring-offset-2" : "hover:shadow-md"
      )}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-sm">{room.name}</h4>
          <p className="text-xs text-muted-foreground">{room.schedule}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {room.students?.length || 0} alunos
          </p>
        </div>
        {room.location && (
          <span className="text-xs text-muted-foreground">{room.location}</span>
        )}
      </div>
    </Card>
  );
};