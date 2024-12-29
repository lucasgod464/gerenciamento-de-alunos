import { Card, CardContent } from "@/components/ui/card"
import { DoorOpen } from "lucide-react"

interface RoomStatsProps {
  totalRooms: number
  activeRooms: number
}

export function RoomStats({ totalRooms, activeRooms }: RoomStatsProps) {
  return (
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
            <p className="text-sm text-muted-foreground">
              {activeRooms} salas ativas
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}