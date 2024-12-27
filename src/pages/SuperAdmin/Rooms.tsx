import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { RoomTable } from "@/components/rooms/RoomTable";
import { RoomFilters } from "@/components/rooms/RoomFilters";
import { RoomStats } from "@/components/rooms/RoomStats";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Room } from "@/types/room";

export default function SuperAdminRooms() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [studyRoomFilter, setStudyRoomFilter] = useState("all");

  // Get rooms from localStorage
  const rooms = JSON.parse(localStorage.getItem("rooms") || "[]");

  const filteredRooms = rooms.filter((room: Room) => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && room.status) ||
      (statusFilter === "inactive" && !room.status);
    const matchesStudyRoom =
      studyRoomFilter === "all" || room.studyRoom === studyRoomFilter;

    return matchesSearch && matchesStatus && matchesStudyRoom;
  });

  const totalRooms = rooms.length;
  const activeRooms = rooms.filter((room: Room) => room.status).length;

  return (
    <DashboardLayout role="super-admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Salas</h1>
        </div>

        <RoomStats totalRooms={totalRooms} activeRooms={activeRooms} />

        <div className="space-y-4">
          <RoomFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            studyRoomFilter={studyRoomFilter}
            onStudyRoomFilterChange={setStudyRoomFilter}
          />

          <RoomTable
            rooms={filteredRooms}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}