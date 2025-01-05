import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StudentFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedRoom: string;
  onRoomChange: (value: string) => void;
  rooms: { id: string; name: string }[];
}

export const StudentFilters = ({
  searchTerm,
  onSearchChange,
  selectedRoom,
  onRoomChange,
  rooms,
}: StudentFiltersProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 flex-1 max-w-2xl">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar alunos..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      <Select value={selectedRoom} onValueChange={onRoomChange}>
        <SelectTrigger>
          <SelectValue placeholder="Filtrar por sala" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todas as salas</SelectItem>
          {rooms.map((room) => (
            <SelectItem key={room.id} value={room.id}>
              {room.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};