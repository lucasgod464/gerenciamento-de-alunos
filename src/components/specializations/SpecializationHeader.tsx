import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";

interface SpecializationHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onNewClick: () => void;
}

export const SpecializationHeader = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onNewClick,
}: SpecializationHeaderProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold mb-2">Especializações</h1>
        <p className="text-muted-foreground">
          Gerencie as especializações do sistema
        </p>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar especializações..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={onStatusFilterChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={onNewClick} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Especialização
        </Button>
      </div>
    </div>
  );
};