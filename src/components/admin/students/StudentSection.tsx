import { Card, CardContent } from "@/components/ui/card";
import { Student } from "@/types/student";
import { StudentTable } from "@/components/user/StudentTable";
import { StudentSearch } from "./StudentSearch";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

interface StudentSectionProps {
  title: string;
  students: Student[];
  rooms: { id: string; name: string }[];
  onDeleteStudent: (id: string) => void;
  onTransferStudent: (studentId: string, newRoomId: string) => void;
  onUpdateStudent: (student: Student) => void;
  variant?: "with-room" | "without-room";
}

export const StudentSection = ({
  title,
  students,
  rooms,
  onDeleteStudent,
  onTransferStudent,
  onUpdateStudent,
  variant = "with-room",
}: StudentSectionProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = useMemo(() => {
    return students.filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  return (
    <Card className={cn(
      variant === "without-room" && "border-red-200 bg-red-50/50",
      variant === "with-room" && "border-blue-200 bg-blue-50/50"
    )}>
      <CardContent className="pt-6">
        <h2 className={cn(
          "text-xl font-semibold mb-4",
          variant === "without-room" && "text-red-700",
          variant === "with-room" && "text-blue-700"
        )}>
          {title}
        </h2>
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