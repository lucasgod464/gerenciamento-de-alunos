import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CompanyFiltersProps {
  statusFilter: string
  onStatusFilterChange: (value: string) => void
}

export function CompanyFilters({
  statusFilter,
  onStatusFilterChange,
}: CompanyFiltersProps) {
  return (
    <div className="mb-4">
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