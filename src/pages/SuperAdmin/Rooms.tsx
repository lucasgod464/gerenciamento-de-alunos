import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Room } from "@/types/room";
import { RoomStats } from "@/components/superadmin/rooms/RoomStats";
import { RoomFilters } from "@/components/superadmin/rooms/RoomFilters";
import { RoomsTable } from "@/components/superadmin/rooms/RoomsTable";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { mapSupabaseRoomToRoom } from "@/types/room";

export default function SuperAdminRooms() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [rooms, setRooms] = useState<Room[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data: roomsData, error } = await supabase
          .from('rooms')
          .select(`
            *,
            room_students (
              student:students (*)
            )
          `);

        if (error) {
          console.error('Error fetching rooms:', error);
          toast({
            title: "Erro",
            description: "Erro ao carregar salas",
            variant: "destructive",
          });
          return;
        }

        if (roomsData) {
          const transformedRooms = roomsData.map(room => mapSupabaseRoomToRoom(room));
          setRooms(transformedRooms);
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar salas",
          variant: "destructive",
        });
      }
    };

    fetchRooms();
  }, [toast]);

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