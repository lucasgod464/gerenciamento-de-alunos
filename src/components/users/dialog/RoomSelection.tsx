import { Room } from "@/types/room";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

interface RoomSelectionProps {
  rooms: Room[];
  selectedRooms: string[];
  onRoomToggle: (roomId: string) => void;
}

export function RoomSelection({ rooms, selectedRooms, onRoomToggle }: RoomSelectionProps) {
  return (
    <div className="space-y-2">
      <Label>Salas Autorizadas</Label>
      <ScrollArea className="h-[200px] w-full rounded-md border p-4">
        <div className="space-y-2">
          {rooms.map((room) => (
            <div key={room.id} className="flex items-center space-x-2">
              <Checkbox
                id={`room-${room.id}`}
                checked={selectedRooms.includes(room.id)}
                onCheckedChange={() => onRoomToggle(room.id)}
              />
              <label
                htmlFor={`room-${room.id}`}
                className="text-sm font-medium leading-none"
              >
                {room.name}
              </label>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
