import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Room } from "@/types/room";
import { RoomStats } from "@/components/superadmin/rooms/RoomStats";
import { RoomFilters } from "@/components/superadmin/rooms/RoomFilters";
import { RoomsTable } from "@/components/superadmin/rooms/RoomsTable";

export default function SuperAdminRooms() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    setRooms(allRooms);
  }, []);

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = 
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.companyId || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || 
                         (filterType === "active" && room.status) ||
                         (filterType === "inactive" && !room.status);
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout role="super-admin">
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Salas</h1>
            <p className="text-muted-foreground">
              Gerencie e monitore todas as salas do sistema
            </p>
          </div>

          <RoomStats rooms={rooms} />
        </div>

        <div className="space-y-6">
          <RoomFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterType={filterType}
            onFilterChange={setFilterType}
          />

          <RoomsTable rooms={filteredRooms} />
        </div>
      </div>
    </DashboardLayout>
  );
}