import { Button } from "@/components/ui/button";
import { CategorySelect } from "@/components/categories/CategorySelect";
import { RoomSelect } from "@/components/user/RoomSelect";

interface AttendanceHeaderProps {
  selectedRoom: string;
  onRoomChange: (value: string) => void;
  onStartAttendance: () => void;
  isAttendanceStarted: boolean;
}

export const AttendanceHeader = ({ 
  selectedRoom, 
  onRoomChange,
  onStartAttendance,
  isAttendanceStarted
}: AttendanceHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Lista de Alunos</h3>
        <p className="text-sm text-muted-foreground">
          Registre a presença dos alunos e adicione observações se necessário
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-[250px]">
          <RoomSelect
            value={selectedRoom}
            onChange={onRoomChange}
          />
        </div>
        <Button 
          onClick={onStartAttendance}
          disabled={!selectedRoom || isAttendanceStarted}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isAttendanceStarted ? "Chamada Iniciada" : "Iniciar Chamada"}
        </Button>
      </div>
    </div>
  );
};