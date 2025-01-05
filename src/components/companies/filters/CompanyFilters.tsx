import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CompanyFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
}

export function CompanyFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: CompanyFiltersProps) {
  return (
    <div className="flex gap-4 justify-end mb-4">
      <Input
        placeholder="Buscar empresa por nome, documento ou ID..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-xs"
      />
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Todos Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos Status</SelectItem>
          <SelectItem value="active">Ativas</SelectItem>
          <SelectItem value="inactive">Inativas</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}