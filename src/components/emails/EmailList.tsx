import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Pencil, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

interface Email {
  id: string
  name: string
  email: string
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
  const [editingEmail, setEditingEmail] = useState<Email | null>(null)

  const handleUpdateEmail = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!editingEmail) return

    const formData = new FormData(event.currentTarget)
    const updatedEmail = {
      ...editingEmail,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      accessLevel: formData.get("accessLevel") as "Admin" | "Usuário Comum",
      company: formData.get("company") as string,
    }

    onUpdateEmail(updatedEmail)
    setEditingEmail(null)
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4">USUÁRIO</th>
            <th className="text-left p-4">NÍVEL DE ACESSO</th>
            <th className="text-left p-4">EMPRESA</th>
            <th className="text-left p-4">CRIADO EM</th>
            <th className="text-right p-4">AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          {emails.map((email) => (
            <tr key={email.id} className="border-b">
              <td className="p-4">
                <div>
                  <div className="font-medium">{email.name}</div>
                  <div className="text-sm text-gray-500">
                    {email.email}
                    <br />
                    ID: {email.id}
                  </div>
                </div>
              </td>
              <td className="p-4">
                <span
                  className={cn(
                    "px-2 py-1 rounded-full text-sm",
                    email.accessLevel === "Admin"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  )}
                >
                  {email.accessLevel}
                </span>
              </td>
              <td className="p-4">{email.company}</td>
              <td className="p-4">{email.createdAt}</td>
              <td className="p-4">
                <div className="flex justify-end space-x-2">
                  <Dialog
                    open={editingEmail?.id === email.id}
                    onOpenChange={(open) =>
                      setEditingEmail(open ? email : null)
                    }
                  >
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Email</DialogTitle>
                        <DialogDescription>
                          Modifique os dados do email.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleUpdateEmail} className="space-y-4">
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
                          <Label htmlFor="edit-accessLevel">
                            Nível de Acesso
                          </Label>
                          <Select
                            name="accessLevel"
                            defaultValue={email.accessLevel}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Admin">Admin</SelectItem>
                              <SelectItem value="Usuário Comum">
                                Usuário Comum
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="edit-company">Empresa</Label>
                          <Select name="company" defaultValue={email.company}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Empresa Exemplo">
                                Empresa Exemplo
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Salvar Alterações</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-red-100 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir Email</AlertDialogTitle>
                        <AlertDialogDescription>
                          Essa ação não pode ser desfeita. Isso excluirá
                          permanentemente o email e todos os dados
                          associados.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDeleteEmail(email.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}