import { Company } from "@/types/company"
import { CompanyListItem } from "./CompanyListItem"

interface CompanyListProps {
  companies: Company[]
  onUpdateCompany: (company: Company) => void
  onDeleteCompany: (id: string) => void
  onResetCompany: (id: string) => void
}

export function CompanyList({
  companies,
  onUpdateCompany,
  onDeleteCompany,
  onResetCompany,
}: CompanyListProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4">EMPRESA</th>
            <th className="text-left p-4">USUÁRIOS</th>
            <th className="text-left p-4">SALAS</th>
            <th className="text-left p-4">STATUS</th>
            <th className="text-left p-4">CRIADO EM</th>
            <th className="text-right p-4">AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <CompanyListItem
              key={company.id}
              company={company}
              onUpdateCompany={onUpdateCompany}
              onDeleteCompany={onDeleteCompany}
              onResetCompany={onResetCompany}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}