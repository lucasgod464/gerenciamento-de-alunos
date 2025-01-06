import { Card, CardContent } from "@/components/ui/card"
import { DoorClosed, DoorOpen, Door } from "lucide-react"
import { Room } from "@/types/room"

interface RoomStatsProps {
  rooms: Room[]
}

export function RoomStats({ rooms }: RoomStatsProps) {
  const totalRooms = rooms.length
  const activeRooms = rooms.filter(room => room.status).length
  const inactiveRooms = rooms.filter(room => !room.status).length

  return (
    <div className="grid gap-3 md:grid-cols-3 mb-6">
      <Card>
        <CardContent className="flex items-center justify-center py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Door className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-medium text-muted-foreground">
                Total de Salas
              </h3>
              <p className="text-2xl font-bold text-blue-600">{totalRooms}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-center py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <DoorOpen className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-medium text-muted-foreground">
                Salas Ativas
              </h3>
              <p className="text-2xl font-bold text-green-600">{activeRooms}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-center py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <DoorClosed className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-medium text-muted-foreground">
                Salas Inativas
              </h3>
              <p className="text-2xl font-bold text-red-600">{inactiveRooms}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}