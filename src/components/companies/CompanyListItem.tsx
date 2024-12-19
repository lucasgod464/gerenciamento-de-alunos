import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Pencil, Trash2, RotateCcw, Folder } from "lucide-react"
import { Company } from "@/types/company"
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
import { useState } from "react"

interface CompanyListItemProps {
  company: Company;
  onUpdateCompany: (company: Company) => void;
  onDeleteCompany: (id: string) => void;
  onResetCompany: (id: string) => void;
}

export function CompanyListItem({
  company,
  onUpdateCompany,
  onDeleteCompany,
  onResetCompany,
}: CompanyListItemProps) {
  const [isEditing, setIsEditing] = useState(false)

  const handleUpdateCompany = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const updatedCompany = {
      ...company,
      name: formData.get("name") as string,
      users_limit: Number(formData.get("usersLimit")),
      rooms_limit: Number(formData.get("roomsLimit")),
    }

    onUpdateCompany(updatedCompany)
    setIsEditing(false)
  }

  return (
    <tr className="border-b">
      <td className="p-4">
        <div>
          <div className="font-medium">{company.name}</div>
          <div className="text-sm text-gray-500">
            ID: {company.id}
            <br />
            <span className="flex items-center gap-1">
              <Folder className="w-4 h-4" />
              {company.document}
            </span>
          </div>
        </div>
      </td>
      <td className="p-4">
        {company.current_users}/{company.users_limit}
      </td>
      <td className="p-4">
        {company.current_rooms}/{company.rooms_limit}
      </td>
      <td className="p-4">
        <span
          className={cn(
            "px-2 py-1 rounded-full text-sm",
            company.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          )}
        >
          {company.status === "active" ? "Ativa" : "Inativa"}
        </span>
      </td>
      <td className="p-4">{new Date(company.created_at).toLocaleDateString()}</td>
      <td className="p-4">
        <div className="flex justify-end space-x-2">
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Pencil className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Empresa</DialogTitle>
                <DialogDescription>
                  Modifique os dados da empresa.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdateCompany} className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Nome da Empresa</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={company.name}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-usersLimit">Limite de Usuários</Label>
                  <Input
                    id="edit-usersLimit"
                    name="usersLimit"
                    type="number"
                    min="1"
                    defaultValue={company.users_limit}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-roomsLimit">Limite de Salas</Label>
                  <Input
                    id="edit-roomsLimit"
                    name="roomsLimit"
                    type="number"
                    min="1"
                    defaultValue={company.rooms_limit}
                    required
                  />
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
                className="hover:bg-yellow-100 hover:text-yellow-600"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Resetar Empresa</AlertDialogTitle>
                <AlertDialogDescription>
                  Isso irá restaurar a empresa para as configurações padrão.
                  Todos os dados serão mantidos, mas os contadores serão
                  zerados.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => onResetCompany(company.id)}>
                  Resetar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

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
                <AlertDialogTitle>Excluir Empresa</AlertDialogTitle>
                <AlertDialogDescription>
                  Essa ação não pode ser desfeita. Isso excluirá
                  permanentemente a empresa e todos os dados associados.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDeleteCompany(company.id)}
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
  )
}