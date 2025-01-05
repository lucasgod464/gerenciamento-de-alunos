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
  company: Company;
  onDelete: (id: string) => void;
  onEdit: (company: Company) => void;
  onUpdateStatus: (company: Company) => void;
}

export function CompanyTableRow({
  company,
  onDelete,
  onEdit,
  onUpdateStatus,
}: CompanyTableRowProps) {
  const { toast } = useToast()

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

  const usersPercentage = (company.currentUsers / company.usersLimit) * 100;
  const roomsPercentage = (company.currentRooms / company.roomsLimit) * 100;

  return (
    <tr className={cn(
      "hover:bg-gray-50 transition-colors",
      company.status === "Inativa" && "bg-gray-50 opacity-75"
    )}>
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
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Users2 className={cn(
              "w-4 h-4",
              usersPercentage >= 90 ? "text-red-500" : 
              usersPercentage >= 70 ? "text-yellow-500" : 
              "text-blue-500"
            )} />
            <span className={cn(
              usersPercentage >= 90 ? "text-red-600" : 
              usersPercentage >= 70 ? "text-yellow-600" : 
              "text-gray-600"
            )}>
              {company.currentUsers}/{company.usersLimit}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={cn(
                "h-1.5 rounded-full",
                usersPercentage >= 90 ? "bg-red-500" : 
                usersPercentage >= 70 ? "bg-yellow-500" : 
                "bg-blue-500"
              )}
              style={{ width: `${usersPercentage}%` }}
            />
          </div>
        </div>
      </td>
      <td className="p-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <DoorOpen className={cn(
              "w-4 h-4",
              roomsPercentage >= 90 ? "text-red-500" : 
              roomsPercentage >= 70 ? "text-yellow-500" : 
              "text-purple-500"
            )} />
            <span className={cn(
              roomsPercentage >= 90 ? "text-red-600" : 
              roomsPercentage >= 70 ? "text-yellow-600" : 
              "text-gray-600"
            )}>
              {company.currentRooms}/{company.roomsLimit}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={cn(
                "h-1.5 rounded-full",
                roomsPercentage >= 90 ? "bg-red-500" : 
                roomsPercentage >= 70 ? "bg-yellow-500" : 
                "bg-purple-500"
              )}
              style={{ width: `${roomsPercentage}%` }}
            />
          </div>
        </div>
      </td>
      <td className="p-4">
        <Switch
          checked={company.status === "Ativa"}
          onCheckedChange={handleStatusChange}
          className={cn(
            "data-[state=checked]:bg-green-500",
            "data-[state=unchecked]:bg-red-500"
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
            disabled={company.status === "Inativa"}
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