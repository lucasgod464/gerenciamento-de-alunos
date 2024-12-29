import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

interface RoomSelectionFieldsProps {
  selectedRooms: string[];
  onRoomToggle: (roomIds: string[]) => void;
}

export function RoomSelectionFields({
  selectedRooms,
  onRoomToggle,
}: RoomSelectionFieldsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { user: currentUser } = useAuth();
  const [rooms, setRooms] = useState<Array<{ id: string; name: string; status: boolean }>>([]);

  useEffect(() => {
    if (!currentUser?.companyId) return;

    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    const companyRooms = allRooms.filter((room: any) => 
      room.companyId === currentUser.companyId && room.status
    );
    setRooms(companyRooms);
  }, [currentUser]);

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRoomToggle = (roomId: string) => {
    const updatedRooms = selectedRooms.includes(roomId)
      ? selectedRooms.filter(id => id !== roomId)
      : [...selectedRooms, roomId];
    onRoomToggle(updatedRooms);
  };

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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 bg-background"
            />
          </div>
          
          <ScrollArea className="h-[120px]">
            <div className="grid grid-cols-2 gap-2 pr-2">
              {filteredRooms.map((room) => (
                <div
                  key={room.id}
                  className="flex items-center space-x-2 p-1.5 hover:bg-accent rounded-md cursor-pointer transition-colors"
                >
                  <Checkbox
                    id={`room-${room.id}`}
                    checked={selectedRooms.includes(room.id)}
                    onCheckedChange={() => handleRoomToggle(room.id)}
                  />
                  <label
                    htmlFor={`room-${room.id}`}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {room.name}
                  </label>
                </div>
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
    </div>
  );
}