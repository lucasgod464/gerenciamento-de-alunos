import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SpecializationFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: "all" | "active" | "inactive";
  setStatusFilter: (value: "all" | "active" | "inactive") => void;
}

export function SpecializationFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}: SpecializationFiltersProps) {
  return (
    <div className="flex gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar especializações..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <select
        className="border rounded-md px-3 py-2"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
      >
        <option value="all">Todos</option>
        <option value="active">Ativos</option>
        <option value="inactive">Inativos</option>
      </select>
    </div>
  );
}