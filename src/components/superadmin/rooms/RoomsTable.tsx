import { Card, CardContent } from "@/components/ui/card";
import { Room } from "@/types/room";
import { Building2, Calendar, MapPin, Tag } from "lucide-react";

interface RoomsTableProps {
  rooms: Room[];
}

export function RoomsTable({ rooms }: RoomsTableProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.length > 0 ? (
        rooms.map((room) => (
          <Card 
            key={room.id} 
            className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border border-gray-100 bg-white"
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                    {room.name}
                  </h3>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      room.status
                        ? "bg-green-50 text-green-700 ring-1 ring-green-600/20"
                        : "bg-orange-50 text-orange-700 ring-1 ring-orange-600/20"
                    }`}
                  >
                    {room.status ? "Ativa" : "Inativa"}
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-gray-600 gap-2">
                    <Building2 className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Empresa:</span>
                    <span className="text-gray-700">{room.companyId || "Sem empresa"}</span>
                  </div>
                  
                  {room.schedule && (
                    <div className="flex items-center text-gray-600 gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Horário:</span>
                      <span className="text-gray-700">{room.schedule}</span>
                    </div>
                  )}
                  
                  {room.location && (
                    <div className="flex items-center text-gray-600 gap-2">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Local:</span>
                      <span className="text-gray-700">{room.location}</span>
                    </div>
                  )}
                  
                  {room.category && (
                    <div className="flex items-center text-gray-600 gap-2">
                      <Tag className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Categoria:</span>
                      <span className="text-gray-700">{room.category}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="col-span-full flex items-center justify-center h-32 text-gray-500">
          Nenhuma sala encontrada
        </div>
      )}
    </div>
  );
}