import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { Pencil, Trash2, Folder, Building2, Users2, DoorOpen } from "lucide-react"
import { CompanyDataUsage } from "./CompanyDataUsage"
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
import { Company } from "./CompanyList"
import { useToast } from "@/components/ui/use-toast"

interface CompanyTableRowProps {
  company: Company
  onDelete: (id: string) => void
  onEdit: (company: Company) => void
}

export function CompanyTableRow({
  company,
  onDelete,
  onEdit,
}: CompanyTableRowProps) {
  const { toast } = useToast()

  const handleStatusChange = () => {
    const updatedCompany = {
      ...company,
      status: company.status === "Ativa" ? "Inativa" : "Ativa"
    }
    onEdit(updatedCompany)
    
    toast({
      title: "Status atualizado",
      description: `A empresa ${company.name} foi ${company.status === "Ativa" ? "desativada" : "ativada"}.`,
    })
  }

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="p-4">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{company.name}</div>
            <div className="text-sm text-gray-500">
              ID: {company.id}
              <br />
              <span className="flex items-center gap-1 text-gray-400">
                <Folder className="w-4 h-4" />
                {company.publicFolderPath}
              </span>
            </div>
          </div>
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <Users2 className="w-4 h-4 text-blue-500" />
          <span>{company.currentUsers}/{company.usersLimit}</span>
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <DoorOpen className="w-4 h-4 text-purple-500" />
          <span>{company.currentRooms}/{company.roomsLimit}</span>
        </div>
      </td>
      <td className="p-4">
        <Switch
          checked={company.status === "Ativa"}
          onCheckedChange={handleStatusChange}
          className={cn(
            "data-[state=checked]:bg-green-500 data-[state=checked]:hover:bg-green-600",
            "data-[state=unchecked]:bg-red-500 data-[state=unchecked]:hover:bg-red-600"
          )}
        />
      </td>
      <td className="p-4 text-gray-500">{company.createdAt}</td>
      <td className="p-4">
        <div className="flex justify-end space-x-2">
          <CompanyDataUsage company={company} />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(company)}
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
                  onClick={() => onDelete(company.id)}
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