import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { RoomStats } from "@/components/rooms/RoomStats";
import { RoomFilters } from "@/components/rooms/RoomFilters";
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

export default function SuperAdminRooms() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    // Get all rooms from localStorage
    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    setRooms(allRooms);
  }, []);

  // Filter rooms based on search term and status
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.companyId || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" ? true :
      statusFilter === "active" ? room.status :
      !room.status;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalRooms: rooms.length,
    activeRooms: rooms.filter(room => room.status).length,
  };

  return (
    <DashboardLayout role="super-admin">
      <div className="container mx-auto py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Salas</h1>
          <p className="text-muted-foreground">
            Gerencie todas as salas do sistema
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid gap-4 md:grid-cols-2">
          <RoomStats
            totalRooms={stats.totalRooms}
            activeRooms={stats.activeRooms}
          />
        </div>

        {/* Filters */}
        <RoomFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {/* Rooms Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome da Sala</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tipo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">{room.name}</TableCell>
                    <TableCell>{room.companyId || "Sem empresa"}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          room.status
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {room.status ? "Ativa" : "Inativa"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {room.studyRoom || "Não definido"}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredRooms.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Nenhuma sala encontrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}