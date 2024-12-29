import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, UserCog, Users } from "lucide-react"

interface EmailStatsProps {
  totalEmails: number
  totalAdmins: number
  totalUsers: number
}

export function EmailStats({ totalEmails, totalAdmins, totalUsers }: EmailStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Emails</CardTitle>
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <Mail className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{totalEmails}</div>
          <p className="text-xs text-muted-foreground mt-1">Emails cadastrados no sistema</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Administradores</CardTitle>
          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
            <UserCog className="h-4 w-4 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{totalAdmins}</div>
          <p className="text-xs text-muted-foreground mt-1">Usuários com acesso administrativo</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Usuários Comuns</CardTitle>
          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
            <Users className="h-4 w-4 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{totalUsers}</div>
          <p className="text-xs text-muted-foreground mt-1">Usuários com acesso padrão</p>
        </CardContent>
      </Card>
    </div>
  )
}