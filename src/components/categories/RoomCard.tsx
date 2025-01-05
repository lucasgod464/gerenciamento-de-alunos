import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";
import { RoomStudentsDialog } from "@/components/rooms/RoomStudentsDialog";
import { useState } from "react";
import { AuthorizedUsersList } from "./AuthorizedUsersList";
import { Room } from "@/types/room";

interface RoomCardProps {
  room: Room;
  onAddUser: (roomId: string) => void;
}

export const RoomCard = ({ room, onAddUser }: RoomCardProps) => {
  const [showStudents, setShowStudents] = useState(false);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{room.name}</h3>
          <p className="text-sm text-muted-foreground">{room.schedule}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddUser(room.id)}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Adicionar Usuário
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Usuários Vinculados</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Total: {room.students?.length || 0} alunos
            </span>
          </div>
          <AuthorizedUsersList roomId={room.id} companyId={room.companyId || ''} />
        </div>
      </div>

      <RoomStudentsDialog
        open={showStudents}
        onOpenChange={setShowStudents}
        students={room.students || []}
        rooms={[{ id: room.id, name: room.name }]}
        currentRoomId={room.id}
        onDeleteStudent={() => {}}
        onTransferStudent={() => {}}
      />
    </Card>
  );
};