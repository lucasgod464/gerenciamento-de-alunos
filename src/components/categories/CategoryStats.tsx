import { Room } from "@/types/room";
import { School, GraduationCap } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CategoryStatsProps {
  rooms: Room[];
}

export const CategoryStats = ({ rooms }: CategoryStatsProps) => {
  const getTotalStudents = () => {
    return rooms.reduce((total, room) => total + (room.students?.length || 0), 0);
  };

  return (
    <div className="flex items-center gap-4 mb-4 p-3 bg-white/30 rounded-lg">
      <div className="flex items-center gap-2">
        <School className="h-4 w-4" />
        <span className="text-sm font-medium">
          {rooms.length} {rooms.length === 1 ? 'sala' : 'salas'}
        </span>
      </div>
      <Separator orientation="vertical" className="h-4" />
      <div className="flex items-center gap-2">
        <GraduationCap className="h-4 w-4" />
        <span className="text-sm font-medium">
          {getTotalStudents()} {getTotalStudents() === 1 ? 'aluno' : 'alunos'}
        </span>
      </div>
    </div>
  );
};
