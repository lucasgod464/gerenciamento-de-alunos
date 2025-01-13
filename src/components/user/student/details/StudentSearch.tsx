import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Student } from "@/types/student";

interface StudentSearchProps {
  onSelectStudent: (student: Student) => void;
}

export function StudentSearch({ onSelectStudent }: StudentSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const searchStudents = async () => {
      if (searchTerm.length < 3) {
        setStudents([]);
        return;
      }

      const { data, error } = await supabase
        .from('students')
        .select('*')
        .ilike('name', `%${searchTerm}%`)
        .limit(5);

      if (error) {
        console.error('Erro ao buscar alunos:', error);
        return;
      }

      setStudents(data || []);
    };

    searchStudents();
  }, [searchTerm]);

  return (
    <div className="space-y-2">
      <Input
        type="text"
        placeholder="Digite o nome do aluno..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {students.length > 0 && (
        <div className="bg-white border rounded-md shadow-sm">
          {students.map((student) => (
            <button
              key={student.id}
              className="w-full px-4 py-2 text-left hover:bg-gray-100"
              onClick={() => {
                onSelectStudent(student);
                setSearchTerm("");
                setStudents([]);
              }}
            >
              {student.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
