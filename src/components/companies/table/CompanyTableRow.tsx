import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { Trash2, Folder, Building2, Users2, DoorOpen, Pencil } from "lucide-react"
import { CompanyDataUsage } from "../CompanyDataUsage"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Company } from "@/types/company"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CompanyTableRowProps {
  company: Company
  onDelete: (id: string) => void
  onEdit: (company: Company) => void
  onUpdateStatus: (company: Company) => void
}

export function CompanyTableRow({
  company,
  onDelete,
  onEdit,
  onUpdateStatus,
}: CompanyTableRowProps) {
  const { toast } = useToast()
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company>(company)

  const handleStatusChange = () => {
    const updatedCompany: Company = {
      ...company,
      status: company.status === "Ativa" ? "Inativa" : "Ativa"
    }
    
    onUpdateStatus(updatedCompany)
    
    toast({
      title: "Status atualizado",
      description: `A empresa ${company.name} foi ${updatedCompany.status === "Ativa" ? "ativada" : "desativada"}.`,
    })
  }

  const handleDelete = async () => {
    try {
      await onDelete(company.id)
      toast({
        title: "Empresa excluída",
        description: `A empresa ${company.name} foi excluída com sucesso.`,
      })
    } catch (error) {
      console.error("Erro ao deletar empresa:", error)
      toast({
        title: "Erro ao excluir empresa",
        description: "Ocorreu um erro ao tentar excluir a empresa. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleEditClick = () => {
    setEditingCompany(company)
    setShowEditDialog(true)
  }

  const handleEditSubmit = () => {
    onEdit(editingCompany)
    setShowEditDialog(false)
    toast({
      title: "Empresa atualizada",
      description: "As informações da empresa foram atualizadas com sucesso.",
    })
  }

  const usersPercentage = (company.currentUsers / company.usersLimit) * 100
  const roomsPercentage = (company.currentRooms / company.roomsLimit) * 100

  return (
    <tr className={cn(
      "hover:bg-gray-50 transition-colors",
      company.status === "Inativa" && "bg-gray-50 opacity-75"
    )}>
      <td className="p-4 min-w-[300px]">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="font-medium text-gray-900 truncate">{company.name}</div>
            <div className="text-sm text-gray-500">
              <span className="block truncate">ID: {company.id}</span>
              <span className="flex items-center gap-1 text-gray-400 truncate">
                <Folder className="w-4 h-4 flex-shrink-0" />
                {company.publicFolderPath}
              </span>
            </div>
          </div>
        </div>
      </td>

      <td className="p-4 text-center min-w-[120px]">
        <UsageIndicator
          icon={<Users2 className="w-4 h-4" />}
          current={company.currentUsers}
          limit={company.usersLimit}
          percentage={usersPercentage}
        />
      </td>

      <td className="p-4 text-center min-w-[120px]">
        <UsageIndicator
          icon={<DoorOpen className="w-4 h-4" />}
          current={company.currentRooms}
          limit={company.roomsLimit}
          percentage={roomsPercentage}
        />
      </td>

      <td className="p-4 text-center min-w-[100px]">
        <div className="flex justify-center">
          <Switch
            checked={company.status === "Ativa"}
            onCheckedChange={handleStatusChange}
            className={cn(
              "data-[state=checked]:bg-green-500",
              "data-[state=unchecked]:bg-red-500"
            )}
          />
        </div>
      </td>

      <td className="p-4 text-center whitespace-nowrap text-gray-500 min-w-[120px]">
        {company.createdAt}
      </td>

      <td className="p-4 min-w-[120px]">
        <div className="flex justify-end space-x-2">
          <CompanyDataUsage company={company} />

          <Button
            variant="ghost"
            size="icon"
            onClick={handleEditClick}
            className="hover:bg-blue-50 hover:text-blue-600"
          >
            <Pencil className="w-4 h-4" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-red-50 hover:text-red-600"
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
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </td>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Empresa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome da Empresa</Label>
              <Input
                id="name"
                value={editingCompany.name}
                onChange={(e) => setEditingCompany({ ...editingCompany, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="document">Documento</Label>
              <Input
                id="document"
                value={editingCompany.document}
                onChange={(e) => setEditingCompany({ ...editingCompany, document: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="usersLimit">Limite de Usuários</Label>
              <Input
                id="usersLimit"
                type="number"
                value={editingCompany.usersLimit}
                onChange={(e) => setEditingCompany({ ...editingCompany, usersLimit: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="roomsLimit">Limite de Salas</Label>
              <Input
                id="roomsLimit"
                type="number"
                value={editingCompany.roomsLimit}
                onChange={(e) => setEditingCompany({ ...editingCompany, roomsLimit: parseInt(e.target.value) })}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditSubmit}>
                Salvar Alterações
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </tr>
  )
}

interface UsageIndicatorProps {
  icon: React.ReactNode
  current: number
  limit: number
  percentage: number
}

function UsageIndicator({ icon, current, limit, percentage }: UsageIndicatorProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className={cn(
          "transition-colors",
          percentage >= 90 ? "text-red-500" : 
          percentage >= 70 ? "text-yellow-500" : 
          "text-blue-500"
        )}>
          {icon}
        </span>
        <span className={cn(
          percentage >= 90 ? "text-red-600" : 
          percentage >= 70 ? "text-yellow-600" : 
          "text-gray-600"
        )}>
          {current}/{limit}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className={cn(
            "h-1.5 rounded-full transition-all",
            percentage >= 90 ? "bg-red-500" : 
            percentage >= 70 ? "bg-yellow-500" : 
            "bg-blue-500"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}