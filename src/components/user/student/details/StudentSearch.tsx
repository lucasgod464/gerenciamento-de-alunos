import { Input } from "@/components/ui/input";
import { Student } from "@/types/student";
import { Card } from "@/components/ui/card";

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
    <div className="relative">
      <Input
        placeholder="Digite o nome do aluno para pesquisar..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full"
      />
      {searchTerm.length >= 3 && students.length > 0 && !selectedStudent && (
        <Card className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto divide-y">
          {students.map((student) => (
            <div
              key={student.id}
              className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onSelectStudent(student)}
            >
              <div className="font-medium">{student.name}</div>
              {student.document && (
                <div className="text-sm text-gray-500">
                  Documento: {student.document}
                </div>
              )}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}