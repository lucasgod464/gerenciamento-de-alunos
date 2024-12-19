import { Table, TableBody } from "@/components/ui/table"
import { EmailTableHeader } from "./EmailTableHeader"
import { EmailTableRow } from "./EmailTableRow"
import { Email } from "@/types/email"
import { EditEmailDialog } from "./EditEmailDialog"
import { useState } from "react"

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

  return (
    <>
      <Table>
        <EmailTableHeader />
        <TableBody>
          {emails.map((email) => (
            <EmailTableRow
              key={email.id}
              email={email}
              onEdit={setEditingEmail}
              onDelete={onDeleteEmail}
            />
          ))}
        </TableBody>
      </Table>

      <EditEmailDialog
        email={editingEmail}
        onClose={() => setEditingEmail(null)}
        onSubmit={onUpdateEmail}
      />
    </>
  )
}