import { Card, CardContent } from "@/components/ui/card"
import { Mail, CheckCircle2, XCircle } from "lucide-react"
import { Email } from "@/types/email"

interface EmailStatsProps {
  data: Email[]
}

export function EmailStats({ data }: EmailStatsProps) {
  const totalEmails = data.length
  const activeEmails = data.filter(email => email.status === "active").length
  const inactiveEmails = data.filter(email => email.status === "inactive").length

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="flex items-center p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total de Emails
              </p>
              <h2 className="text-2xl font-bold">{totalEmails}</h2>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Emails Ativos
              </p>
              <h2 className="text-2xl font-bold">{activeEmails}</h2>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Emails Inativos
              </p>
              <h2 className="text-2xl font-bold">{inactiveEmails}</h2>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}