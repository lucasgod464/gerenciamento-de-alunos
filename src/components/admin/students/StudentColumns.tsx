import { Card, CardContent } from "@/components/ui/card";
import { Student } from "@/types/student";
import { StudentTable } from "@/components/user/StudentTable";
import { StudentSearch } from "./StudentSearch";
import { useState } from "react";

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
  const [searchWithoutRoom, setSearchWithoutRoom] = useState("");
  const [searchWithRoom, setSearchWithRoom] = useState("");

  const filteredStudentsWithoutRoom = studentsWithoutRoom.filter(student =>
    student.name.toLowerCase().includes(searchWithoutRoom.toLowerCase())
  );

  const filteredStudentsWithRoom = studentsWithRoom.filter(student =>
    student.name.toLowerCase().includes(searchWithRoom.toLowerCase())
  );
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Alunos sem Sala</h2>
          <StudentSearch 
            value={searchWithoutRoom}
            onChange={setSearchWithoutRoom}
            placeholder="Buscar alunos sem sala..."
          />
          <StudentTable 
            students={filteredStudentsWithoutRoom}
            rooms={rooms}
            onDeleteStudent={onDeleteStudent}
            onTransferStudent={onTransferStudent}
            onUpdateStudent={onUpdateStudent}
            showTransferOption={true}
          />
          {filteredStudentsWithoutRoom.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              Nenhum aluno sem sala encontrado
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Alunos com Sala</h2>
          <StudentSearch 
            value={searchWithRoom}
            onChange={setSearchWithRoom}
            placeholder="Buscar alunos com sala..."
          />
          <StudentTable 
            students={filteredStudentsWithRoom}
            rooms={rooms}
            onDeleteStudent={onDeleteStudent}
            onTransferStudent={onTransferStudent}
            onUpdateStudent={onUpdateStudent}
            showTransferOption={true}
          />
          {filteredStudentsWithRoom.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              Nenhum aluno com sala encontrado
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};