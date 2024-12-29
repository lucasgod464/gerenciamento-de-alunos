import { Card, CardContent } from "@/components/ui/card"
import { Building2, Users } from "lucide-react"

interface RoomStatsProps {
  totalRooms: number
  activeRooms: number
}

export function RoomStats({ totalRooms, activeRooms }: RoomStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardContent className="flex items-center p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total de Salas
              </p>
              <h2 className="text-2xl font-bold">{totalRooms}</h2>
              <p className="text-sm text-muted-foreground">
                {activeRooms} salas ativas
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Taxa de Ativação
              </p>
              <h2 className="text-2xl font-bold">
                {totalRooms > 0
                  ? Math.round((activeRooms / totalRooms) * 100)
                  : 0}
                %
              </h2>
              <p className="text-sm text-muted-foreground">
                Das salas estão ativas
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}