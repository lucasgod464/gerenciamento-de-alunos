import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"

interface Email {
  id: string
  name: string
  email: string
  password: string
  accessLevel: "Admin" | "Usuário Comum"
  company: string
  createdAt: string
}

interface EditEmailDialogProps {
  email: Email | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEmailUpdated: (email: Email) => void
}

export function EditEmailDialog({ email, open, onOpenChange, onEmailUpdated }: EditEmailDialogProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState<Email | null>(null)

  useEffect(() => {
    if (email) {
      setFormData(email)
    }
  }, [email])

  const { data: companies = [] } = useQuery({
    queryKey: ["companies"],
    queryFn: () => {
      const storedCompanies = localStorage.getItem("companies")
      return storedCompanies ? JSON.parse(storedCompanies) : []
    },
  })

  const updateEmailMutation = useMutation({
    mutationFn: (updatedEmail: Email) => {
      const currentEmails = JSON.parse(localStorage.getItem("createdEmails") || "[]")
      const newEmails = currentEmails.map((e: Email) =>
        e.id === updatedEmail.id ? updatedEmail : e
      )
      localStorage.setItem("createdEmails", JSON.stringify(newEmails))
      return updatedEmail
    },
    onSuccess: (updatedEmail) => {
      queryClient.invalidateQueries({ queryKey: ["emails"] })
      onEmailUpdated(updatedEmail)
      onOpenChange(false)
      toast({
        title: "Email atualizado",
        description: "As informações do email foram atualizadas com sucesso.",
      })
    },
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formData) return

    updateEmailMutation.mutate(formData)
  }

  if (!formData) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Email</DialogTitle>
          <DialogDescription>
            Atualize as informações do email no sistema.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accessLevel">Nível de Acesso</Label>
            <Select
              value={formData.accessLevel}
              onValueChange={(value) => setFormData({ ...formData, accessLevel: value as "Admin" | "Usuário Comum" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o nível de acesso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Usuário Comum">Usuário Comum</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Empresa</Label>
            <Select
              value={formData.company}
              onValueChange={(value) => setFormData({ ...formData, company: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a empresa" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company: { id: string; name: string }) => (
                  <SelectItem key={company.id} value={company.name}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            Salvar Alterações
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}