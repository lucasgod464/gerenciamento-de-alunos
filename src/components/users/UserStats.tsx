import { Card, CardContent } from "@/components/ui/card"
import { Users, UserCheck, UserX } from "lucide-react"

interface UserStatsProps {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
}

export function UserStats({ totalUsers, activeUsers, inactiveUsers }: UserStatsProps) {
  return (
    <div className="grid gap-3 md:grid-cols-3 mb-6">
      <Card>
        <CardContent className="flex items-center justify-center py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-medium text-muted-foreground">
                Total de Usuários
              </h3>
              <p className="text-2xl font-bold text-blue-600">{totalUsers}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-center py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-medium text-muted-foreground">
                Usuários Ativos
              </h3>
              <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-center py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <UserX className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-medium text-muted-foreground">
                Usuários Inativos
              </h3>
              <p className="text-2xl font-bold text-red-600">{inactiveUsers}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}