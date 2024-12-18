import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Pencil, Trash2, RotateCcw, Folder } from "lucide-react"
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

interface Company {
  id: string
  name: string
  document: string
  usersLimit: number
  currentUsers: number
  roomsLimit: number
  currentRooms: number
  status: "Ativa" | "Inativa"
  createdAt: string
  publicFolderPath: string
}

interface CompanyListProps {
  companies: Company[]
  onUpdateCompany: (company: Company) => void
  onDeleteCompany: (id: string) => void
  onResetCompany: (id: string) => void
}

export function CompanyList({
  companies,
  onUpdateCompany,
  onDeleteCompany,
  onResetCompany,
}: CompanyListProps) {
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)

  const handleUpdateCompany = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!editingCompany) return

    const formData = new FormData(event.currentTarget)
    const updatedCompany = {
      ...editingCompany,
      name: formData.get("name") as string,
      usersLimit: Number(formData.get("usersLimit")),
      roomsLimit: Number(formData.get("roomsLimit")),
    }

    onUpdateCompany(updatedCompany)
    setEditingCompany(null)
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4">EMPRESA</th>
            <th className="text-left p-4">USUÁRIOS</th>
            <th className="text-left p-4">SALAS</th>
            <th className="text-left p-4">STATUS</th>
            <th className="text-left p-4">CRIADO EM</th>
            <th className="text-right p-4">AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id} className="border-b">
              <td className="p-4">
                <div>
                  <div className="font-medium">{company.name}</div>
                  <div className="text-sm text-gray-500">
                    ID: {company.id}
                    <br />
                    <span className="flex items-center gap-1">
                      <Folder className="w-4 h-4" />
                      {company.publicFolderPath}
                    </span>
                  </div>
                </div>
              </td>
              <td className="p-4">
                {company.currentUsers}/{company.usersLimit}
              </td>
              <td className="p-4">
                {company.currentRooms}/{company.roomsLimit}
              </td>
              <td className="p-4">
                <span
                  className={cn(
                    "px-2 py-1 rounded-full text-sm",
                    company.status === "Ativa"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  )}
                >
                  {company.status}
                </span>
              </td>
              <td className="p-4">{company.createdAt}</td>
              <td className="p-4">
                <div className="flex justify-end space-x-2">
                  <Dialog
                    open={editingCompany?.id === company.id}
                    onOpenChange={(open) =>
                      setEditingCompany(open ? company : null)
                    }
                  >
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
                          <Label htmlFor="edit-usersLimit">
                            Limite de Usuários
                          </Label>
                          <Input
                            id="edit-usersLimit"
                            name="usersLimit"
                            type="number"
                            min="1"
                            defaultValue={company.usersLimit}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-roomsLimit">
                            Limite de Salas
                          </Label>
                          <Input
                            id="edit-roomsLimit"
                            name="roomsLimit"
                            type="number"
                            min="1"
                            defaultValue={company.roomsLimit}
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
                          Isso irá restaurar a empresa para as configurações
                          padrão. Todos os dados serão mantidos, mas os
                          contadores serão zerados.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onResetCompany(company.id)}
                        >
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
                          permanentemente a empresa e todos os dados
                          associados.
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
          ))}
        </tbody>
      </table>
    </div>
  )
}