import { DashboardLayout } from "@/components/DashboardLayout"
import { EmailList } from "@/components/emails/EmailList"
import { EmailStats } from "@/components/emails/EmailStats"
import { useToast } from "@/hooks/use-toast"
import { useQuery } from "@tanstack/react-query"

const Emails = () => {
  const { toast } = useToast()

  // Buscar emails criados pelo super admin
  const { data: emails = [] } = useQuery({
    queryKey: ["createdEmails"],
    queryFn: () => {
      const storedEmails = localStorage.getItem("createdEmails")
      return storedEmails ? JSON.parse(storedEmails) : []
    },
  })

  // Buscar usuários criados pelos administradores
  const { data: usersFromAdmins = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => {
      const storedUsers = localStorage.getItem("users")
      return storedUsers ? JSON.parse(storedUsers) : []
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

  // Combinar todos os emails do sistema
  const allEmails = [...emails, ...usersAsEmails]

  const totalAdmins = allEmails.filter((email: any) => 
    email.accessLevel === "Admin" || 
    email.accessLevel === "Administrador"
  ).length

  const totalUsers = allEmails.filter((email: any) => 
    email.accessLevel === "Usuário Comum" || 
    email.accessLevel === "User"
  ).length

  const handleUpdateEmail = (updatedEmail: any) => {
    const allEmails = JSON.parse(localStorage.getItem("createdEmails") || "[]")
    const updatedEmails = allEmails.map((email: any) =>
      email.id === updatedEmail.id ? updatedEmail : email
    )
    localStorage.setItem("createdEmails", JSON.stringify(updatedEmails))
    toast({
      title: "Email atualizado",
      description: "As informações do email foram atualizadas com sucesso.",
    })
  }

  const handleDeleteEmail = (id: string) => {
    const allEmails = JSON.parse(localStorage.getItem("createdEmails") || "[]")
    const updatedEmails = allEmails.filter((email: any) => email.id !== id)
    localStorage.setItem("createdEmails", JSON.stringify(updatedEmails))
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

        <EmailStats 
          totalEmails={allEmails.length} 
          totalAdmins={totalAdmins}
          totalUsers={totalUsers}
        />

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