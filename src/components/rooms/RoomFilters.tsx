import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface RoomFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export function RoomFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: RoomFiltersProps) {
  return (
    <div className="flex gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, horário, endereço ou categoria..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <select
        className="border rounded-md px-3 py-2"
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
      >
        <option value="all">Todos Status</option>
        <option value="active">Ativas</option>
        <option value="inactive">Inativas</option>
      </select>
    </div>
  );
}