import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"
import { EmailTableRow } from "./EmailTableRow"
import { EmailSearchBar } from "./EmailSearchBar"
import { CreateEmailDialog } from "./CreateEmailDialog"
import { useToast } from "@/hooks/use-toast"

interface Email {
  id: string
  name: string
  email: string
  accessLevel: "Admin" | "Usuário Comum"
  company: string
  createdAt: string
}

interface EmailListProps {
  emails: Email[]
  onUpdateEmail: (email: Email) => void
  onDeleteEmail: (id: string) => void
}

export function EmailList({
  emails,
  onUpdateEmail,
  onDeleteEmail,
}: EmailListProps) {
  const [search, setSearch] = useState("")
  const [accessLevelFilter, setAccessLevelFilter] = useState("")
  const [companyFilter, setCompanyFilter] = useState("")
  const { toast } = useToast()

  const handleEmailCreated = (email: Email) => {
    onUpdateEmail(email)
    toast({
      title: "Email criado",
      description: "O email foi criado com sucesso.",
    })
  }

  const filteredEmails = emails.filter((email) => {
    const matchesSearch =
      email.name.toLowerCase().includes(search.toLowerCase()) ||
      email.email.toLowerCase().includes(search.toLowerCase())
    const matchesAccessLevel = !accessLevelFilter || email.accessLevel === accessLevelFilter
    const matchesCompany = !companyFilter || email.company === companyFilter

    return matchesSearch && matchesAccessLevel && matchesCompany
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Lista de Emails</h2>
        <CreateEmailDialog onEmailCreated={handleEmailCreated} />
      </div>

      <EmailSearchBar
        onSearchChange={setSearch}
        onAccessLevelChange={setAccessLevelFilter}
        onCompanyChange={setCompanyFilter}
      />

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>USUÁRIO</TableHead>
              <TableHead>NÍVEL DE ACESSO</TableHead>
              <TableHead>EMPRESA</TableHead>
              <TableHead>CRIADO EM</TableHead>
              <TableHead className="text-right">AÇÕES</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmails.map((email) => (
              <EmailTableRow
                key={email.id}
                email={email}
                onEdit={onUpdateEmail}
                onDelete={onDeleteEmail}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}