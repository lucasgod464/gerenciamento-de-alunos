import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";

interface Room {
  id: string;
  name: string;
  status: boolean;
}

interface RoomSelectionFieldsProps {
  rooms: Room[];
  selectedRooms: string[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onRoomToggle: (roomId: string) => void;
}

export function RoomSelectionFields({
  rooms,
  selectedRooms,
  searchQuery,
  onSearchChange,
  onRoomToggle,
}: RoomSelectionFieldsProps) {
  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <Label>Salas Autorizadas</Label>
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar salas..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      <ScrollArea className="h-[200px] border rounded-md p-2">
        <div className="space-y-2">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md"
            >
              <Checkbox
                id={`room-${room.id}`}
                checked={selectedRooms.includes(room.id)}
                onCheckedChange={() => onRoomToggle(room.id)}
              />
              <Label
                htmlFor={`room-${room.id}`}
                className="cursor-pointer flex-grow"
              >
                {room.name}
              </Label>
            </div>
          ))}
          {filteredRooms.length === 0 && (
            <div className="text-center text-muted-foreground py-4">
              Nenhuma sala encontrada
            </div>
          )}
        </div>
      </ScrollArea>
      <input type="hidden" name="authorizedRooms" value={JSON.stringify(selectedRooms)} />
    </div>
  );
}