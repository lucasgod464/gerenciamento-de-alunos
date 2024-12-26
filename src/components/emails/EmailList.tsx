import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"
import { EmailTableRow } from "./EmailTableRow"
import { EmailSearchBar } from "./EmailSearchBar"
import { CreateEmailDialog } from "./CreateEmailDialog"
import { EditEmailDialog } from "./EditEmailDialog"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { useQuery, useQueryClient } from "@tanstack/react-query"

interface Email {
  id: string
  name: string
  email: string
  password: string
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
  const [editingEmail, setEditingEmail] = useState<Email | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Buscar usuários criados pelos administradores
  const { data: usersFromAdmins = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => {
      const storedUsers = localStorage.getItem("users")
      return storedUsers ? JSON.parse(storedUsers) : []
    },
  })

  // Buscar emails criados pelo super admin
  const { data: createdEmails = [] } = useQuery({
    queryKey: ["createdEmails"],
    queryFn: () => {
      const storedEmails = localStorage.getItem("createdEmails")
      return storedEmails ? JSON.parse(storedEmails) : []
    },
  })

  // Converter usuários para o formato de email
  const usersAsEmails = usersFromAdmins.map((user: any) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password,
    accessLevel: "Usuário Comum",
    company: user.companyId,
    createdAt: user.createdAt,
  }))

  // Combinar emails sem duplicação
  const allEmails = [...usersAsEmails, ...createdEmails]
  const uniqueEmails = allEmails.filter((email, index, self) =>
    index === self.findIndex((e) => e.id === email.id)
  )

  const handleEmailCreated = (email: Email) => {
    queryClient.invalidateQueries({ queryKey: ["createdEmails"] })
    onUpdateEmail(email)
    toast({
      title: "Email criado",
      description: "O email foi criado com sucesso.",
    })
  }

  const handleEditEmail = (email: Email) => {
    setEditingEmail(email)
    setIsEditDialogOpen(true)
  }

  const handleEmailUpdated = (email: Email) => {
    queryClient.invalidateQueries({ queryKey: ["createdEmails"] })
    onUpdateEmail(email)
    setEditingEmail(null)
  }

  // Filtra os emails baseado no papel do usuário e nos filtros aplicados
  const filteredEmails = uniqueEmails.filter((email) => {
    const matchesSearch =
      email.name.toLowerCase().includes(search.toLowerCase()) ||
      email.email.toLowerCase().includes(search.toLowerCase()) ||
      email.company.toLowerCase().includes(search.toLowerCase())
    
    const matchesAccessLevel = !accessLevelFilter || accessLevelFilter === "all" || email.accessLevel === accessLevelFilter

    if (user?.role === "SUPER_ADMIN") {
      return matchesSearch && matchesAccessLevel
    }
    
    return email.company === user?.companyId && matchesSearch && matchesAccessLevel
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
                onEdit={handleEditEmail}
                onDelete={onDeleteEmail}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <EditEmailDialog
        email={editingEmail}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onEmailUpdated={handleEmailUpdated}
      />
    </div>
  )
}