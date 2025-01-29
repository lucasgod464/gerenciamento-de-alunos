import { Student } from "@/types/student";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentSection } from "./StudentSection";
import { cn } from "@/lib/utils";

interface StudentColumnsProps {
  studentsWithoutRoom: Student[];
  studentsWithRoom: Student[];
  rooms: { id: string; name: string }[];
  onDeleteStudent: (id: string) => void;
  onTransferStudent: (studentId: string, newRoomId: string) => void;
  onUpdateStudent: (student: Student) => void;
}

export const StudentColumns = ({
  studentsWithoutRoom,
  studentsWithRoom,
  rooms,
  onDeleteStudent,
  onTransferStudent,
  onUpdateStudent,
}: StudentColumnsProps) => {
  return (
    <Tabs defaultValue="without-room" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1">
        <TabsTrigger 
          value="without-room"
          className={cn(
            "transition-all duration-200",
            "data-[state=active]:bg-red-50 data-[state=active]:text-red-700",
            "data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900"
          )}
        >
          Alunos sem Sala
        </TabsTrigger>
        <TabsTrigger 
          value="with-room"
          className={cn(
            "transition-all duration-200",
            "data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700",
            "data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900"
          )}
        >
          Alunos com Sala
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="without-room" className="mt-4">
        <StudentSection
          title="Alunos sem Sala"
          students={studentsWithoutRoom}
          rooms={rooms}
          onDeleteStudent={onDeleteStudent}
          onTransferStudent={onTransferStudent}
          onUpdateStudent={onUpdateStudent}
          variant="without-room"
        />
      </TabsContent>
      
      <TabsContent value="with-room" className="mt-4">
        <StudentSection
          title="Alunos com Sala"
          students={studentsWithRoom}
          rooms={rooms}
          onDeleteStudent={onDeleteStudent}
          onTransferStudent={onTransferStudent}
          onUpdateStudent={onUpdateStudent}
          variant="with-room"
        />
      </TabsContent>
    </Tabs>
  );
};