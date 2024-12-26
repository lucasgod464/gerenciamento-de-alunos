import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EmailSearchBarProps {
  onSearchChange: (value: string) => void
  onAccessLevelChange: (value: string) => void
}

export function EmailSearchBar({
  onSearchChange,
  onAccessLevelChange,
}: EmailSearchBarProps) {
  return (
    <div className="flex gap-4 mb-6">
      <Input
        placeholder="Buscar por nome, email ou empresa..."
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1"
      />
      <Select defaultValue="all" onValueChange={onAccessLevelChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Nível de Acesso" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="Admin">Admin</SelectItem>
          <SelectItem value="Usuário Comum">Usuário Comum</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}