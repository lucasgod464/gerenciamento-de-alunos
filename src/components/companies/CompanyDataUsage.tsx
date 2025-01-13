import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Database, HardDrive, Server, HardDriveDownload } from "lucide-react"

interface CompanyDataUsageProps {
  company: {
    name: string
    currentUsers: number
    currentRooms: number
    usersLimit: number
    roomsLimit: number
    storageUsed: number // in bytes
  }
}

function formatStorage(bytes: number): string {
  const gigabyte = 1024 * 1024 * 1024;
  const megabyte = 1024 * 1024;

  if (bytes >= gigabyte) {
    return `${(bytes / gigabyte).toFixed(2)} GB`;
  }
  return `${(bytes / megabyte).toFixed(2)} MB`;
}

export function CompanyDataUsage({ company }: CompanyDataUsageProps) {
  const usersPercentage = (company.currentUsers / company.usersLimit) * 100
  const roomsPercentage = (company.currentRooms / company.roomsLimit) * 100
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Database className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Uso de Dados - {company.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
            <Server className="w-6 h-6 text-blue-600" />
            <div className="flex-1">
              <p className="text-sm font-medium">Usuários</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {company.currentUsers} de {company.usersLimit}
                </span>
                <span className="text-sm font-medium">
                  {Math.round(usersPercentage)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${usersPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
            <HardDrive className="w-6 h-6 text-purple-600" />
            <div className="flex-1">
              <p className="text-sm font-medium">Salas</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {company.currentRooms} de {company.roomsLimit}
                </span>
                <span className="text-sm font-medium">
                  {Math.round(roomsPercentage)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div
                  className="bg-purple-600 h-2.5 rounded-full"
                  style={{ width: `${roomsPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
            <HardDriveDownload className="w-6 h-6 text-green-600" />
            <div className="flex-1">
              <p className="text-sm font-medium">Armazenamento</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {formatStorage(company.storageUsed)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
