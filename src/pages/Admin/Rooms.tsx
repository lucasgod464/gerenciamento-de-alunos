import { DashboardLayout } from "@/components/DashboardLayout";
import { RoomTable } from "@/components/rooms/RoomTable";
import { RoomDialog } from "@/components/rooms/RoomDialog";
import { RoomFilters } from "@/components/rooms/RoomFilters";
import { useRooms } from "@/hooks/useRooms";
import { Room } from "@/types/room";

const AdminRooms = () => {
  const { rooms, loading, handleSave, handleDeleteConfirm } = useRooms();

  const handleDelete = (id: string) => {
    handleDeleteConfirm(id);
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Salas</h1>
          <p className="text-muted-foreground">
            Gerencie as salas da sua escola
          </p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <RoomFilters />
          <RoomDialog onSave={handleSave} />
        </div>

        <RoomTable 
          rooms={rooms} 
          loading={loading}
          onDelete={handleDelete}
          onEdit={handleSave}
        />
      </div>
    </DashboardLayout>
  );
};

export default AdminRooms;