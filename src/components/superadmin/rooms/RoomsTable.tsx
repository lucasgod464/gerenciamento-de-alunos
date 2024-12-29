import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Room } from "@/types/room";

interface RoomsTableProps {
  rooms: Room[];
}

export function RoomsTable({ rooms }: RoomsTableProps) {
  return (
    <Card className="border border-gray-100 shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
              <TableHead className="w-[300px] py-4 text-sm font-semibold text-gray-700">
                Nome da Sala
              </TableHead>
              <TableHead className="py-4 text-sm font-semibold text-gray-700">
                Empresa
              </TableHead>
              <TableHead className="py-4 text-sm font-semibold text-gray-700 text-right pr-6">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.length > 0 ? (
              rooms.map((room) => (
                <TableRow 
                  key={room.id} 
                  className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                >
                  <TableCell className="py-4 font-medium text-gray-900">
                    {room.name}
                  </TableCell>
                  <TableCell className="py-4 text-gray-600">
                    {room.companyId || "Sem empresa"}
                  </TableCell>
                  <TableCell className="py-4 text-right pr-6">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        room.status
                          ? "bg-green-50 text-green-700 ring-1 ring-green-600/20"
                          : "bg-orange-50 text-orange-700 ring-1 ring-orange-600/20"
                      }`}
                    >
                      {room.status ? "Ativa" : "Inativa"}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={3} 
                  className="h-32 text-center text-gray-500"
                >
                  Nenhuma sala encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}