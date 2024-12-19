import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQuery } from "@tanstack/react-query"

interface EmailSearchBarProps {
  onSearchChange: (value: string) => void
  onAccessLevelChange: (value: string) => void
  onCompanyChange: (value: string) => void
}

interface Company {
  id: string
  name: string
}

export function EmailSearchBar({
  onSearchChange,
  onAccessLevelChange,
  onCompanyChange,
}: EmailSearchBarProps) {
  const { data: companies = [] } = useQuery({
    queryKey: ["companies"],
    queryFn: () => {
      const storedCompanies = JSON.parse(localStorage.getItem("companies") || "[]")
      return storedCompanies
    },
  })

  return (
    <div className="flex gap-4 mb-6">
      <Input
        placeholder="Buscar por nome ou email..."
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1"
      />
      <Select defaultValue="all" onValueChange={onAccessLevelChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Nível de Acesso" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="user">Usuário Comum</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="all" onValueChange={onCompanyChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Empresa" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          {companies.map((company: Company) => (
            <SelectItem key={company.id} value={company.id || "no-id"}>
              {company.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}