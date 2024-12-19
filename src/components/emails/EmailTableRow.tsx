import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Email {
  id: string
  name: string
  email: string
  accessLevel: "Admin" | "Usuário Comum"
  company: string
  createdAt: string
}

interface EmailTableRowProps {
  email: Email
  onEdit: (email: Email) => void
  onDelete: (id: string) => void
}

export function EmailTableRow({ email, onEdit, onDelete }: EmailTableRowProps) {
  return (
    <tr className="border-b">
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(email)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-red-100 hover:text-red-600"
            onClick={() => onDelete(email.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  )
}