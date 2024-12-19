import { useState } from "react"
import { DashboardLayout } from "@/components/DashboardLayout"
import { Input } from "@/components/ui/input"
import { CreateEmailDialog } from "@/components/emails/CreateEmailDialog"
import { EmailList } from "@/components/emails/EmailList"
import { EmailStats } from "@/components/emails/EmailStats"
import { useToast } from "@/components/ui/use-toast"

interface Email {
  id: string
  name: string
  email: string
  accessLevel: "Admin" | "Usuário Comum"
  company: string
  createdAt: string
}

const initialEmails: Email[] = [
  {
    id: "460027488",
    name: "John Doe",
    email: "john@example.com",
    accessLevel: "Admin",
    company: "Empresa Exemplo",
    createdAt: "17/12/2024",
  },
]

const Emails = () => {
  const [emails, setEmails] = useState<Email[]>(initialEmails)
  const [search, setSearch] = useState("")
  const { toast } = useToast()

  const handleCreateEmail = (newEmail: Email) => {
    setEmails([...emails, newEmail])
  }

  const handleUpdateEmail = (updatedEmail: Email) => {
    const updatedEmails = emails.map((email) =>
      email.id === updatedEmail.id ? updatedEmail : email
    )
    setEmails(updatedEmails)
    toast({
      title: "Email atualizado",
      description: "As informações do email foram atualizadas com sucesso.",
    })
  }

  const handleDeleteEmail = (id: string) => {
    setEmails(emails.filter((email) => email.id !== id))
    toast({
      title: "Email excluído",
      description: "O email foi excluído permanentemente.",
      variant: "destructive",
    })
  }

  const filteredEmails = emails.filter(
    (email) =>
      email.name.toLowerCase().includes(search.toLowerCase()) ||
      email.email.toLowerCase().includes(search.toLowerCase()) ||
      email.company.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout role="super-admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Gerenciamento de Emails</h1>
          <p className="text-muted-foreground">
            Gerencie todos os emails cadastrados no sistema
          </p>
        </div>

        <EmailStats totalEmails={emails.length} />

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Lista de Emails</h2>
          <CreateEmailDialog onEmailCreated={handleCreateEmail} />
        </div>

        <div className="max-w-xl">
          <Input
            placeholder="Buscar emails..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <EmailList
          emails={filteredEmails}
          onUpdateEmail={handleUpdateEmail}
          onDeleteEmail={handleDeleteEmail}
        />
      </div>
    </DashboardLayout>
  )
}

export default Emails