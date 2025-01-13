import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CompanyTableRow } from "./CompanyTableRow"
import { Company } from "@/types/company"

interface CompanyTableProps {
  companies: Company[]
  onUpdateCompany: (company: Company) => void
  onDeleteCompany: (id: string) => void
}

export function CompanyTable({ 
  companies, 
  onUpdateCompany, 
  onDeleteCompany 
}: CompanyTableProps) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Usuários</TableHead>
            <TableHead>Salas</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <CompanyTableRow
              key={company.id}
              company={company}
              onEdit={onUpdateCompany}
              onDelete={onDeleteCompany}
              onUpdateStatus={onUpdateCompany}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
