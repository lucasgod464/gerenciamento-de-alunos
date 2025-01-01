import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"
import { EmailTableRow } from "./EmailTableRow"
import { EmailSearchBar } from "./EmailSearchBar"
import { CreateEmailDialog } from "./CreateEmailDialog"
import { EditEmailDialog } from "./EditEmailDialog"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Email, mapSupabaseEmailToEmail, SupabaseEmail } from "@/types/email"
import { supabase } from "@/integrations/supabase/client"

export function EmailList() {
  const [search, setSearch] = useState("")
  const [accessLevelFilter, setAccessLevelFilter] = useState("")
  const [editingEmail, setEditingEmail] = useState<Email | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: emails = [], isLoading } = useQuery({
    queryKey: ["emails"],
    queryFn: async () => {
      const query = supabase
        .from("emails")
        .select(`
          *,
          companies (
            id,
            name,
            status
          )
        `)

      if (user?.role !== "SUPER_ADMIN") {
        query.eq("company_id", user?.companyId)
      }

      const { data, error } = await query

      if (error) throw error

      return data.map((email: SupabaseEmail) => mapSupabaseEmailToEmail(email))
    },
  })

  const handleEmailCreated = (newEmail: Email) => {
    queryClient.invalidateQueries({ queryKey: ["emails"] })
    toast({
      title: "Email criado",
      description: "O email foi criado com sucesso.",
    })
  }

  const handleEditEmail = (email: Email) => {
    setEditingEmail(email)
    setIsEditDialogOpen(true)
  }

  const handleEmailUpdated = (updatedEmail: Email) => {
    queryClient.invalidateQueries({ queryKey: ["emails"] })
    setEditingEmail(null)
  }

  const handleDeleteEmail = async (id: string) => {
    try {
      const { error } = await supabase
        .from("emails")
        .delete()
        .eq("id", id)

      if (error) throw error

      queryClient.invalidateQueries({ queryKey: ["emails"] })
      toast({
        title: "Email excluído",
        description: "O email foi excluído com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao excluir email:", error)
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o email.",
        variant: "destructive",
      })
    }
  }

  const filteredEmails = emails.filter((email) => {
    const matchesSearch =
      email.name.toLowerCase().includes(search.toLowerCase()) ||
      email.email.toLowerCase().includes(search.toLowerCase()) ||
      email.company.toLowerCase().includes(search.toLowerCase())
    
    const matchesAccessLevel = !accessLevelFilter || 
      accessLevelFilter === "all" || 
      email.accessLevel === accessLevelFilter

    return matchesSearch && matchesAccessLevel
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
                onDelete={handleDeleteEmail}
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
