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
    <div className="flex gap-2 items-center mb-4">
      <Input
        placeholder="Buscar empresa por nome, documento ou ID..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-[400px]"
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