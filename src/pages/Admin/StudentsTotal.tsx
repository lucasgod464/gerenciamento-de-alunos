import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Student } from "@/types/student";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function StudentsTotal() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const { data: studentsData, error } = await supabase
        .from('students')
        .select('*')
        .eq('company_id', currentUser?.companyId);

      if (error) throw error;

      const mappedStudents = studentsData.map(student => ({
        id: student.id,
        name: student.name,
        birthDate: student.birth_date,
        status: student.status,
        email: student.email,
        document: student.document,
        address: student.address,
        customFields: student.custom_fields as Record<string, string> | null,
        companyId: student.company_id,
        createdAt: student.created_at,
      }));
      
      setStudents(mappedStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Erro ao carregar alunos",
        description: "Ocorreu um erro ao carregar a lista de alunos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [currentUser]);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Total de Alunos</h1>
            <p className="text-muted-foreground">
              Gerencie os alunos do sistema
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Data de Nascimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Documento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    {student.birthDate ? new Date(student.birthDate).toLocaleDateString('pt-BR') : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={student.status ? "success" : "destructive"}>
                      {student.status ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>{student.email || '-'}</TableCell>
                  <TableCell>{student.document || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default StudentsTotal;