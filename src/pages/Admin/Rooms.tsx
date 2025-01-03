import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { RoomStats } from "@/components/rooms/RoomStats";
import { RoomFilters } from "@/components/rooms/RoomFilters";
import { RoomTable } from "@/components/rooms/RoomTable";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Room, SupabaseRoom, mapSupabaseRoomToRoom } from "@/types/room";

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const { toast } = useToast();

  const fetchRooms = async () => {
    try {
      const { data: roomsData, error } = await supabase
        .from("rooms")
        .select(`
          *,
          room_authorized_users (
            user_id
          ),
          room_students (
            student:students (
              *
            )
          )
        `);

      if (error) throw error;

      const formattedRooms = (roomsData as SupabaseRoom[]).map(room => 
        mapSupabaseRoomToRoom(room)
      );

      setRooms(formattedRooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast({
        title: "Erro ao carregar salas",
        description: "Não foi possível carregar as salas. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Gerenciamento de Salas</h1>
          <p className="text-muted-foreground">
            Gerencie todas as salas cadastradas no sistema
          </p>
        </div>

        <RoomStats rooms={rooms} />
        <RoomFilters 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
        <RoomTable rooms={rooms} onEdit={() => {}} onDelete={() => {}} />
      </div>
    </DashboardLayout>
  );
};

export default Rooms;