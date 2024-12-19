import { Card, CardContent } from "@/components/ui/card"
import { Users } from "lucide-react"

interface UserStatsProps {
  totalUsers: number
  activeUsers: number
}

export function UserStats({ totalUsers, activeUsers }: UserStatsProps) {
  return (
    <Card>
      <CardContent className="flex items-center p-6">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total de Usuários
            </p>
            <h2 className="text-2xl font-bold">{totalUsers}</h2>
            <p className="text-sm text-muted-foreground">
              {activeUsers} usuários ativos
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}