import { DashboardLayout } from "@/components/DashboardLayout"
import { EmailList } from "@/components/emails/EmailList"
import { EmailStats } from "@/components/emails/EmailStats"
import { useState } from "react"

const mockEmails = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    accessLevel: "Admin" as const,
    company: "Empresa Exemplo",
    createdAt: "2024-01-01",
  },
]

const Emails = () => {
  const [emails] = useState(mockEmails)

  const handleUpdateEmail = (updatedEmail: typeof mockEmails[0]) => {
    console.log("Update email:", updatedEmail)
  }

  const handleDeleteEmail = (id: string) => {
    console.log("Delete email:", id)
  }

  return (
    <DashboardLayout role="super-admin">
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Gerenciamento de Emails</h1>
          <p className="text-muted-foreground">
            Gerencie todos os emails cadastrados no sistema
          </p>
        </div>

        <EmailStats totalEmails={emails.length} />

        <EmailList
          emails={emails}
          onUpdateEmail={handleUpdateEmail}
          onDeleteEmail={handleDeleteEmail}
        />
      </div>
    </DashboardLayout>
  )
}

export default Emails