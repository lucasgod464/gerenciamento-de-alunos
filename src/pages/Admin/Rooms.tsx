import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { RoomStats } from "@/components/rooms/RoomStats";
import { RoomFilters } from "@/components/rooms/RoomFilters";
import { RoomTable } from "@/components/rooms/RoomTable";
import { useRooms } from "@/hooks/useRooms";

export default function AdminRooms() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const { rooms } = useRooms();

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = 
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.location || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || 
                         (filterType === "active" && room.status) ||
                         (filterType === "inactive" && !room.status);
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout role="admin">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col items-center mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Gerenciamento de Salas
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Gerencie todas as salas cadastradas no sistema
          </p>
        </div>

        <div className="space-y-8">
          <RoomStats rooms={rooms} />
          
          <div className="space-y-6">
            <RoomFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filterType={filterType}
              onFilterChange={setFilterType}
            />

            <RoomTable rooms={filteredRooms} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}