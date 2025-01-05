import { Student } from "@/types/student";
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StudentSection
        title="Alunos sem Sala"
        students={studentsWithoutRoom}
        rooms={rooms}
        onDeleteStudent={onDeleteStudent}
        onTransferStudent={onTransferStudent}
        onUpdateStudent={onUpdateStudent}
      />
      <StudentSection
        title="Alunos com Sala"
        students={studentsWithRoom}
        rooms={rooms}
        onDeleteStudent={onDeleteStudent}
        onTransferStudent={onTransferStudent}
        onUpdateStudent={onUpdateStudent}
      />
    </div>
  );
};