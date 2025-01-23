import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Student } from "@/types/student";
import { useAuth } from "@/hooks/useAuth";

interface StudentSearchProps {
  onSelectStudent: (student: Student) => void;
}

export function StudentSearch({ onSelectStudent }: StudentSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const searchStudents = async () => {
      if (searchTerm.length < 3) {
        setStudents([]);
        return;
      }

      try {
        // Primeiro, buscar as salas autorizadas do usuário
        const { data: userRooms } = await supabase
          .from('user_rooms')
          .select('room_id')
          .eq('user_id', user?.id);

        if (!userRooms?.length) {
          setStudents([]);
          return;
        }

        const roomIds = userRooms.map(ur => ur.room_id);

        // Buscar alunos que estão nas salas autorizadas
        const { data, error } = await supabase
          .from('students')
          .select(`
            *,
            room_students!inner (
              room_id
            )
          `)
          .ilike('name', `%${searchTerm}%`)
          .in('room_students.room_id', roomIds)
          .limit(5);

        if (error) {
          console.error('Erro ao buscar alunos:', error);
          return;
        }

        const mappedStudents = data.map(student => ({
          id: student.id,
          name: student.name,
          birthDate: student.birth_date,
          status: student.status,
          email: student.email || '',
          document: student.document || '',
          address: student.address || '',
          customFields: student.custom_fields || {},
          companyId: student.company_id,
          createdAt: student.created_at
        }));

        setStudents(mappedStudents);
      } catch (error) {
        console.error('Erro ao buscar alunos:', error);
        setStudents([]);
      }
    };

    searchStudents();
  }, [searchTerm, user?.id]);

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