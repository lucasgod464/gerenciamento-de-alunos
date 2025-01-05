import { cn } from "@/lib/utils"
import { Users2 } from "lucide-react"

interface UsersIndicatorProps {
  currentUsers: number;
  usersLimit: number;
}

export function UsersIndicator({ currentUsers, usersLimit }: UsersIndicatorProps) {
  const usersPercentage = (currentUsers / usersLimit) * 100;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Users2 className={cn(
          "w-4 h-4",
          usersPercentage >= 90 ? "text-red-500" : 
          usersPercentage >= 70 ? "text-yellow-500" : 
          "text-blue-500"
        )} />
        <span className={cn(
          usersPercentage >= 90 ? "text-red-600" : 
          usersPercentage >= 70 ? "text-yellow-600" : 
          "text-gray-600"
        )}>
          {currentUsers}/{usersLimit}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className={cn(
            "h-1.5 rounded-full",
            usersPercentage >= 90 ? "bg-red-500" : 
            usersPercentage >= 70 ? "bg-yellow-500" : 
            "bg-blue-500"
          )}
          style={{ width: `${usersPercentage}%` }}
        />
      </div>
    </div>
  );
}