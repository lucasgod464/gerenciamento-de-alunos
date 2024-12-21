import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="space-y-3">
      <Label className="text-base font-semibold">Salas Autorizadas</Label>
      <Card className="border-muted">
        <CardContent className="p-3 space-y-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar salas..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 bg-background"
              size="sm"
            />
          </div>
          
          <ScrollArea className="h-[120px]">
            <div className="grid grid-cols-2 gap-2 pr-2">
              {filteredRooms.map((room) => (
                <label
                  key={room.id}
                  className="flex items-center space-x-2 p-1.5 hover:bg-accent rounded-md cursor-pointer transition-colors text-sm"
                >
                  <Checkbox
                    id={`room-${room.id}`}
                    checked={selectedRooms.includes(room.id)}
                    onCheckedChange={() => onRoomToggle(room.id)}
                  />
                  <span className="truncate">{room.name}</span>
                </label>
              ))}
              {filteredRooms.length === 0 && (
                <div className="col-span-2 text-center text-muted-foreground py-4">
                  Nenhuma sala encontrada
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      <input type="hidden" name="authorizedRooms" value={JSON.stringify(selectedRooms)} />
    </div>
  );
}