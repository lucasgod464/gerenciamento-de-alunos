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
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <RoomSelector
          rooms={rooms}
          selectedRoom={selectedRoom}
          onRoomChange={onRoomChange}
          className="w-full md:w-auto"
        />
        <DateRangeFilter
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
          className="w-full md:w-auto"
        />
      </div>
      <Button variant="outline" onClick={onRefresh}>
        <RefreshCw className="mr-2 h-4 w-4" />
        Atualizar
      </Button>
    </div>
  );
};
