import { cn } from "@/lib/utils"
import { DoorOpen } from "lucide-react"

interface RoomsIndicatorProps {
  currentRooms: number;
  roomsLimit: number;
}

export function RoomsIndicator({ currentRooms, roomsLimit }: RoomsIndicatorProps) {
  const roomsPercentage = (currentRooms / roomsLimit) * 100;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <DoorOpen className={cn(
          "w-4 h-4",
          roomsPercentage >= 90 ? "text-red-500" : 
          roomsPercentage >= 70 ? "text-yellow-500" : 
          "text-purple-500"
        )} />
        <span className={cn(
          roomsPercentage >= 90 ? "text-red-600" : 
          roomsPercentage >= 70 ? "text-yellow-600" : 
          "text-gray-600"
        )}>
          {currentRooms}/{roomsLimit}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className={cn(
            "h-1.5 rounded-full",
            roomsPercentage >= 90 ? "bg-red-500" : 
            roomsPercentage >= 70 ? "bg-yellow-500" : 
            "bg-purple-500"
          )}
          style={{ width: `${roomsPercentage}%` }}
        />
      </div>
    </div>
  );
}