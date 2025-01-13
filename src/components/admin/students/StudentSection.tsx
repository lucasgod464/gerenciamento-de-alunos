import { Card, CardContent } from "@/components/ui/card";
import { Student } from "@/types/student";
import { StudentTable } from "@/components/user/StudentTable";
import { StudentSearch } from "./StudentSearch";
import { useState, useMemo } from "react";

interface StudentSectionProps {
  title: string;
  students: Student[];
  rooms: { id: string; name: string }[];
  onDeleteStudent: (id: string) => void;
  onTransferStudent: (studentId: string, newRoomId: string) => void;
  onUpdateStudent: (student: Student) => void;
}

export const StudentSection = ({
  title,
  students,
  rooms,
  onDeleteStudent,
  onTransferStudent,
  onUpdateStudent,
}: StudentSectionProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = useMemo(() => {
    return students.filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <StudentSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder={`Buscar em ${title.toLowerCase()}...`}
        />
        <StudentTable 
          students={filteredStudents}
          rooms={rooms}
          onDeleteStudent={onDeleteStudent}
          onTransferStudent={onTransferStudent}
          onUpdateStudent={onUpdateStudent}
          showTransferOption={true}
        />
        {filteredStudents.length === 0 && (
          <p className="text-center text-muted-foreground py-4">
            Nenhum aluno encontrado
          </p>
        )}
      </CardContent>
    </Card>
  );
};
