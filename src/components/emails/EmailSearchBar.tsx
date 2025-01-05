import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { CreateEmailDialog } from "./CreateEmailDialog"

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
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar por nome, email ou empresa..."
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 max-w-[800px]"
        />
      </div>
      <div className="flex gap-2">
        <Select defaultValue="all" onValueChange={onAccessLevelChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Nível de Acesso" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos Status</SelectItem>
            <SelectItem value="Admin">Administrador</SelectItem>
            <SelectItem value="Usuário Comum">Usuário Comum</SelectItem>
          </SelectContent>
        </Select>
        <CreateEmailDialog onEmailCreated={() => {}} />
      </div>
    </div>
  )
}