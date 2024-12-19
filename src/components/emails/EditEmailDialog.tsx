import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Email } from "@/types/email"

interface EditEmailDialogProps {
  email: Email | null
  onClose: () => void
  onSubmit: (email: Email) => void
}

export function EditEmailDialog({ email, onClose, onSubmit }: EditEmailDialogProps) {
  if (!email) return null

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const updatedEmail: Email = {
      ...email,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      access_level: formData.get("access_level") as "Admin" | "Usuário Comum",
      company_id: formData.get("company_id") as string,
    }
    onSubmit(updatedEmail)
    onClose()
  }

  return (
    <Dialog open={!!email} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Email</DialogTitle>
          <DialogDescription>Modifique os dados do email.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-name">Nome Completo</Label>
            <Input
              id="edit-name"
              name="name"
              defaultValue={email.name}
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              name="email"
              type="email"
              defaultValue={email.email}
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-access_level">Nível de Acesso</Label>
            <Select name="access_level" defaultValue={email.access_level}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Usuário Comum">Usuário Comum</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="edit-company">Empresa</Label>
            <Select name="company_id" defaultValue={email.company_id || ""}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="company-1">Empresa Exemplo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit">Salvar Alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}