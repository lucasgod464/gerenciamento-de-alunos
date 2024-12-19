import { TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function EmailTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>USUÁRIO</TableHead>
        <TableHead>NÍVEL DE ACESSO</TableHead>
        <TableHead>EMPRESA</TableHead>
        <TableHead>CRIADO EM</TableHead>
        <TableHead className="text-right">AÇÕES</TableHead>
      </TableRow>
    </TableHeader>
  )
}