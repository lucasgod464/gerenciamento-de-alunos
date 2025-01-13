import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { RoomSelector } from "./RoomSelector";
import { DateRangeFilter } from "./DateRangeFilter";
import { DateRange } from "@/types/attendance";
import { Room } from "@/types/room";

interface ReportHeaderProps {
  rooms: Room[];
  selectedRoom: string;
  dateRange: DateRange;
  onRoomChange: (roomId: string) => void;
  onDateRangeChange: (range: DateRange) => void;
  onRefresh: () => void;
}

export const ReportHeader = ({
  rooms,
  selectedRoom,
  dateRange,
  onRoomChange,
  onDateRangeChange,
  onRefresh,
}: ReportHeaderProps) => {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between">
      <div className="flex gap-4 items-center flex-wrap">
        <RoomSelector
          rooms={rooms}
          selectedRoom={selectedRoom}
          onRoomChange={onRoomChange}
        />
        <DateRangeFilter
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
        />
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Atualizar
        </Button>
      </div>
    </div>
  );
};
