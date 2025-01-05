import { Input } from "@/components/ui/input";
import { Student } from "@/types/student";

interface StudentSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  students: Student[];
  onSelectStudent: (student: Student) => void;
  selectedStudent: Student | null;
}

export function StudentSearch({
  searchTerm,
  onSearchChange,
  students,
  onSelectStudent,
  selectedStudent,
}: StudentSearchProps) {
  return (
    <div>
      <Input
        placeholder="Digite o nome do aluno..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full"
      />
      {searchTerm.length >= 3 && students.length > 0 && !selectedStudent && (
        <div className="mt-2 border rounded-md divide-y">
          {students.map((student) => (
            <div
              key={student.id}
              className="p-2 hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelectStudent(student)}
            >
              {student.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}