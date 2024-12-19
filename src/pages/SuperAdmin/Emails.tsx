import { DashboardLayout } from "@/components/DashboardLayout"
import { EmailList } from "@/components/emails/EmailList"
import { EmailStats } from "@/components/emails/EmailStats"
import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"

interface Email {
  id: string
  name: string
  email: string
  accessLevel: "Admin" | "Usuário Comum"
  company: string
  createdAt: string
}

const Emails = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Buscar emails do localStorage
  const { data: emails = [] } = useQuery({
    queryKey: ["emails"],
    queryFn: () => {
      const storedEmails = localStorage.getItem("createdEmails")
      return storedEmails ? JSON.parse(storedEmails) : []
    },
  })

  // Mutation para atualizar email
  const updateEmailMutation = useMutation({
    mutationFn: (updatedEmail: Email) => {
      const currentEmails = JSON.parse(localStorage.getItem("createdEmails") || "[]")
      const newEmails = currentEmails.map((email: Email) =>
        email.id === updatedEmail.id ? updatedEmail : email
      )
      localStorage.setItem("createdEmails", JSON.stringify(newEmails))
      return updatedEmail
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails"] })
      toast({
        title: "Email atualizado",
        description: "As informações do email foram atualizadas com sucesso.",
      })
    },
  })

  // Mutation para deletar email
  const deleteEmailMutation = useMutation({
    mutationFn: (id: string) => {
      const currentEmails = JSON.parse(localStorage.getItem("createdEmails") || "[]")
      const newEmails = currentEmails.filter((email: Email) => email.id !== id)
      localStorage.setItem("createdEmails", JSON.stringify(newEmails))
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails"] })
      toast({
        title: "Email excluído",
        description: "O email foi excluído permanentemente.",
        variant: "destructive",
      })
    },
  })

  const handleUpdateEmail = (updatedEmail: Email) => {
    updateEmailMutation.mutate(updatedEmail)
  }

  const handleDeleteEmail = (id: string) => {
    deleteEmailMutation.mutate(id)
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