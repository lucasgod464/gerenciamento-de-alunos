import { Student } from "@/types/student";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentSection } from "./StudentSection";

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
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="without-room">Alunos sem Sala</TabsTrigger>
        <TabsTrigger value="with-room">Alunos com Sala</TabsTrigger>
      </TabsList>
      
      <TabsContent value="without-room">
        <StudentSection
          title="Alunos sem Sala"
          students={studentsWithoutRoom}
          rooms={rooms}
          onDeleteStudent={onDeleteStudent}
          onTransferStudent={onTransferStudent}
          onUpdateStudent={onUpdateStudent}
        />
      </TabsContent>
      
      <TabsContent value="with-room">
        <StudentSection
          title="Alunos com Sala"
          students={studentsWithRoom}
          rooms={rooms}
          onDeleteStudent={onDeleteStudent}
          onTransferStudent={onTransferStudent}
          onUpdateStudent={onUpdateStudent}
        />
      </TabsContent>
    </Tabs>
  );
};