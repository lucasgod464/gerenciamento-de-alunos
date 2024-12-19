import { DashboardLayout } from "@/components/DashboardLayout"
import { EmailList } from "@/components/emails/EmailList"
import { EmailStats } from "@/components/emails/EmailStats"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface Email {
  id: string
  name: string
  email: string
  accessLevel: "Admin" | "Usuário Comum"
  company: string
  createdAt: string
}

const Emails = () => {
  const [emails, setEmails] = useState<Email[]>([])
  const { toast } = useToast()

  useEffect(() => {
    // Carregar emails do localStorage
    const storedEmails = JSON.parse(localStorage.getItem("createdEmails") || "[]")
    setEmails(storedEmails)
  }, [])

  const handleUpdateEmail = (updatedEmail: Email) => {
    const newEmails = emails.map((email) =>
      email.id === updatedEmail.id ? updatedEmail : email
    )
    setEmails(newEmails)
    localStorage.setItem("createdEmails", JSON.stringify(newEmails))
    toast({
      title: "Email atualizado",
      description: "As informações do email foram atualizadas com sucesso.",
    })
  }

  const handleDeleteEmail = (id: string) => {
    const newEmails = emails.filter((email) => email.id !== id)
    setEmails(newEmails)
    localStorage.setItem("createdEmails", JSON.stringify(newEmails))
    toast({
      title: "Email excluído",
      description: "O email foi excluído permanentemente.",
      variant: "destructive",
    })
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