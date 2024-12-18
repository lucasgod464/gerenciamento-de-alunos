import { Card, CardContent } from "@/components/ui/card"
import { Building2, Users, DoorOpen } from "lucide-react"

interface CompanyStatsProps {
  totalCompanies: number
  totalUsers: number
  totalRooms: number
}

export function CompanyStats({
  totalCompanies,
  totalUsers,
  totalRooms,
}: CompanyStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="flex items-center p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total de Empresas
              </p>
              <h2 className="text-2xl font-bold">{totalCompanies}</h2>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Usuários Ativos
              </p>
              <h2 className="text-2xl font-bold">{totalUsers}</h2>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DoorOpen className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total de Salas
              </p>
              <h2 className="text-2xl font-bold">{totalRooms}</h2>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}