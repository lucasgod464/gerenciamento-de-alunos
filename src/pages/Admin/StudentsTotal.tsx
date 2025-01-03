import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Student } from "@/types/student";
import { supabase } from "@/integrations/supabase/client";
import { mapSupabaseStudentToStudent } from "@/types/student";

export function StudentsTotal() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);

  const fetchStudents = async () => {
    try {
      const { data: studentsData, error } = await supabase
        .from('students')
        .select('*')
        .eq('company_id', currentUser?.companyId);

      if (error) throw error;

      const mappedStudents = studentsData.map(student => 
        mapSupabaseStudentToStudent(student)
      );
      setStudents(mappedStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Erro ao carregar alunos",
        description: "Ocorreu um erro ao carregar a lista de alunos.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [currentUser]);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Total de Alunos</h1>
          <p className="text-muted-foreground">
            Gerencie os alunos do sistema
          </p>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Render your student data here */}
          {students.map(student => (
            <div key={student.id} className="p-4 border-b">
              <h2 className="text-lg font-semibold">{student.name}</h2>
              <p>Status: {student.status ? "Ativo" : "Inativo"}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
