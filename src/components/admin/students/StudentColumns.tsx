import { Card, CardContent } from "@/components/ui/card";
import { Student } from "@/types/student";
import { StudentTable } from "@/components/user/StudentTable";

interface StudentColumnsProps {
  studentsWithoutRoom: Student[];
  studentsWithRoom: Student[];
  rooms: { id: string; name: string }[];
  onDeleteStudent: (id: string) => void;
  onTransferStudent: (studentId: string, newRoomId: string) => void;
}

export const StudentColumns = ({
  studentsWithoutRoom,
  studentsWithRoom,
  rooms,
  onDeleteStudent,
  onTransferStudent,
}: StudentColumnsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Alunos sem Sala</h2>
          <StudentTable 
            students={studentsWithoutRoom}
            rooms={rooms}
            onDeleteStudent={onDeleteStudent}
            onTransferStudent={onTransferStudent}
            showTransferOption={true}
          />
          {studentsWithoutRoom.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              Nenhum aluno sem sala encontrado
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Alunos com Sala</h2>
          <StudentTable 
            students={studentsWithRoom}
            rooms={rooms}
            onDeleteStudent={onDeleteStudent}
            onTransferStudent={onTransferStudent}
            showTransferOption={true}
          />
          {studentsWithRoom.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              Nenhum aluno com sala encontrado
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};