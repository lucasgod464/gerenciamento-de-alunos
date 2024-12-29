import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: string;
  onFilterChange: (value: string) => void;
}

export function RoomFilters({ searchTerm, onSearchChange, filterType, onFilterChange }: FiltersProps) {
  return (
    <div className="flex gap-4 items-center mb-6">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome da sala ou empresa..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-10"
        />
      </div>
      <Select
        value={filterType}
        onValueChange={onFilterChange}
      >
        <SelectTrigger className="w-[180px] h-10">
          <SelectValue placeholder="Filtrar por status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as salas</SelectItem>
          <SelectItem value="active">Salas ativas</SelectItem>
          <SelectItem value="inactive">Salas inativas</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}