import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/DashboardLayout"
import { Input } from "@/components/ui/input"
import { CreateEmailDialog } from "@/components/emails/CreateEmailDialog"
import { EmailList } from "@/components/emails/EmailList"
import { EmailStats } from "@/components/emails/EmailStats"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Email } from "@/types/email"

const Emails = () => {
  const [emails, setEmails] = useState<Email[]>([])
  const [search, setSearch] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchEmails()
  }, [])

  const fetchEmails = async () => {
    try {
      const { data, error } = await supabase
        .from("emails")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      // Cast the data to ensure access_level is of the correct type
      const typedData = (data || []).map(email => ({
        ...email,
        access_level: email.access_level as "Admin" | "Usuário Comum"
      }))

      setEmails(typedData)
    } catch (error: any) {
      toast({
        title: "Erro ao carregar emails",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleCreateEmail = (newEmail: Email) => {
    setEmails([newEmail, ...emails])
  }

  const handleUpdateEmail = async (updatedEmail: Email) => {
    try {
      const { error } = await supabase
        .from("emails")
        .update(updatedEmail)
        .eq("id", updatedEmail.id)

      if (error) throw error

      const updatedEmails = emails.map((email) =>
        email.id === updatedEmail.id ? updatedEmail : email
      )
      setEmails(updatedEmails)
      toast({
        title: "Email atualizado",
        description: "As informações do email foram atualizadas com sucesso.",
      })
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar email",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleDeleteEmail = async (id: string) => {
    try {
      const { error } = await supabase.from("emails").delete().eq("id", id)

      if (error) throw error

      setEmails(emails.filter((email) => email.id !== id))
      toast({
        title: "Email excluído",
        description: "O email foi excluído permanentemente.",
      })
    } catch (error: any) {
      toast({
        title: "Erro ao excluir email",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const filteredEmails = emails.filter(
    (email) =>
      email.name.toLowerCase().includes(search.toLowerCase()) ||
      email.email.toLowerCase().includes(search.toLowerCase())
  )

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