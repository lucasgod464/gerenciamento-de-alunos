import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmailTableRow } from "./EmailTableRow";

export interface Email {
  id: string;
  name: string;
  email: string;
  accessLevel: "Admin" | "Usuário Comum";
  companyId: string;
  companyName?: string;
  companyStatus?: "Ativa" | "Inativa";
  createdAt: string;
  updatedAt: string;
}

interface EmailListProps {
  data: Email[];
  onUpdateEmail: (email: Email) => void;
  onDeleteEmail: (id: string) => void;
}

export function EmailList({ data, onUpdateEmail, onDeleteEmail }: EmailListProps) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Nível de Acesso</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead>Status da Empresa</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((email) => (
            <EmailTableRow
              key={email.id}
              email={email}
              onUpdate={onUpdateEmail}
              onDelete={onDeleteEmail}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}