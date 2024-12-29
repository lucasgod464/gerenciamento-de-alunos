import { Card, CardContent } from "@/components/ui/card";
import { Room } from "@/types/room";

interface RoomsTableProps {
  rooms: Room[];
}

export function RoomsTable({ rooms }: RoomsTableProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {rooms.length > 0 ? (
        rooms.map((room) => (
          <Card 
            key={room.id} 
            className="transition-all duration-200 hover:shadow-lg border border-gray-100"
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {room.name}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      room.status
                        ? "bg-green-50 text-green-700 ring-1 ring-green-600/20"
                        : "bg-orange-50 text-orange-700 ring-1 ring-orange-600/20"
                    }`}
                  >
                    {room.status ? "Ativa" : "Inativa"}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">Empresa:</span>
                    <span>{room.companyId || "Sem empresa"}</span>
                  </div>
                  
                  {room.schedule && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">Horário:</span>
                      <span>{room.schedule}</span>
                    </div>
                  )}
                  
                  {room.location && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">Local:</span>
                      <span>{room.location}</span>
                    </div>
                  )}
                  
                  {room.category && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">Categoria:</span>
                      <span>{room.category}</span>
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