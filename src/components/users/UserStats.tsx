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
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex flex-col items-center space-y-1.5">
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-base font-medium text-muted-foreground">
              Total de Usuários
            </h3>
            <p className="text-3xl font-bold text-blue-600">{totalUsers}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex flex-col items-center space-y-1.5">
            <div className="p-2 bg-green-100 rounded-full">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-base font-medium text-muted-foreground">
              Usuários Ativos
            </h3>
            <p className="text-3xl font-bold text-green-600">{activeUsers}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex flex-col items-center space-y-1.5">
            <div className="p-2 bg-red-100 rounded-full">
              <UserX className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-base font-medium text-muted-foreground">
              Usuários Inativos
            </h3>
            <p className="text-3xl font-bold text-red-600">{inactiveUsers}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
