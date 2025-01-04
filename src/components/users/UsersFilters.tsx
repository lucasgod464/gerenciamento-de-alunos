import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { CreateUserDialog } from "./CreateUserDialog";

interface UsersFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onUserCreated: () => void;
}

export function UsersFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onUserCreated,
}: UsersFiltersProps) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email, localização ou especialização..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 transition-all duration-200 hover:border-primary focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-3">
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Todos os Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
            <CreateUserDialog onUserCreated={onUserCreated} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}