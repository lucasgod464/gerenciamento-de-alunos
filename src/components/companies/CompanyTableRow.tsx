import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Pencil, Trash2, RotateCcw, Folder } from "lucide-react"
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

interface CompanyTableRowProps {
  company: Company
  onDelete: (id: string) => void
  onReset: (id: string) => void
  onEdit: (company: Company) => void
}

export function CompanyTableRow({
  company,
  onDelete,
  onReset,
  onEdit,
}: CompanyTableRowProps) {
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
          <CompanyDataUsage company={company} />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(company)}
          >
            <Pencil className="w-4 h-4" />
          </Button>

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
                <AlertDialogAction onClick={() => onReset(company.id)}>
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
