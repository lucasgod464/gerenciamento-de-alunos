import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
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
import { Email } from "@/types/email"

interface EmailTableRowProps {
  email: Email
  onUpdate: (email: Email) => void
  onDelete: (id: string) => void
}

export function EmailTableRow({ email, onUpdate, onDelete }: EmailTableRowProps) {
  const isCompanyActive = email.company?.status === "Ativa"

  const handleEdit = () => {
    onUpdate(email)
  }

  return (
    <TableRow className="hover:bg-gray-50 transition-colors">
      <TableCell>
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            email.accessLevel === "Admin" ? "bg-purple-100" : "bg-blue-100"
          )}>
            <Mail className={cn(
              "w-5 h-5",
              email.accessLevel === "Admin" ? "text-purple-600" : "text-blue-600"
            )} />
          </div>
          <div className="text-left">
            <div className="font-medium">{email.name}</div>
            <div className="text-sm text-gray-500">
              {email.email}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-left">{email.email}</TableCell>
      <TableCell className="text-left">
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
            email.accessLevel === "Admin"
              ? "bg-purple-100 text-purple-800"
              : "bg-blue-100 text-blue-800"
          )}
        >
          {email.accessLevel}
        </span>
      </TableCell>
      <TableCell className="text-left">{email.company?.name}</TableCell>
      <TableCell className="text-left">
        <span className="inline-flex items-center">
          <span 
            className={cn(
              "w-2 h-2 rounded-full mr-2",
              isCompanyActive ? "bg-green-400" : "bg-[#ea384c]"
            )}
          ></span>
          {isCompanyActive ? "Ativa" : "Inativa"}
        </span>
      </TableCell>
      <TableCell className="text-left">
        {format(new Date(email.createdAt), "dd/MM/yyyy 'às' HH:mm", {
          locale: ptBR,
        })}
      </TableCell>
      <TableCell>
        <div className="flex justify-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEdit}
            className="hover:bg-gray-100"
          >
            <Pencil className="w-4 h-4 text-gray-600" />
          </Button>
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
                  Essa ação não pode ser desfeita. Isso excluirá permanentemente o email e todos os dados associados.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(email.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  )
}