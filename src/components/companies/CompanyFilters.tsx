import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface CompanyFiltersProps {
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  searchValue: string
  onSearchChange: (value: string) => void
}

export function CompanyFilters({
  statusFilter,
  onStatusFilterChange,
  searchValue,
  onSearchChange,
}: CompanyFiltersProps) {
  return (
    <div className="flex gap-4 mb-4">
      <Input
        placeholder="Buscar empresas..."
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1"
      />
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrar por status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          <SelectItem value="active">Ativas</SelectItem>
          <SelectItem value="inactive">Inativas</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}