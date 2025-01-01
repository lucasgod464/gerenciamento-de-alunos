import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CompanyTableRow } from "./CompanyTableRow";

export interface Company {
  id: string;
  name: string;
  document: string;
  usersLimit: number;
  currentUsers: number;
  roomsLimit: number;
  currentRooms: number;
  status: "Ativa" | "Inativa";
  createdAt: string;
  publicFolderPath: string;
  storageUsed: number;
}

interface CompanyListProps {
  companies: Company[];
  onUpdateCompany: (company: Company) => void;
  onDeleteCompany: (id: string) => void;
}

export function CompanyList({ companies, onUpdateCompany, onDeleteCompany }: CompanyListProps) {
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
  );
}