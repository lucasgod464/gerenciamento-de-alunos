import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";
import type { Student, SupabaseStudent, mapSupabaseStudentToStudent } from "@/types/student";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";

const StudentsTotal = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [newStudentName, setNewStudentName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  const fetchStudents = async () => {
    if (!user?.companyId) return;

    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('company_id', user.companyId);

      if (error) throw error;

      const mappedStudents = data.map((student: SupabaseStudent) => 
        mapSupabaseStudentToStudent(student, '', user.companyId || '')
      );
      
      setStudents(mappedStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os alunos.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [user]);

  const handleCreateStudent = async () => {
    if (!newStudentName.trim() || !user?.companyId) return;
    
    try {
      const { error } = await supabase
        .from('students')
        .insert([{
          name: newStudentName.trim(),
          status: true,
          company_id: user.companyId,
          birth_date: new Date().toISOString(),
          created_at: new Date().toISOString(),
        }]);

      if (error) throw error;
      
      fetchStudents();
      setNewStudentName("");
      toast({
        title: "Aluno criado",
        description: "O aluno foi criado com sucesso.",
      });
    } catch (error) {
      console.error('Error creating student:', error);
      toast({
        title: "Erro ao criar aluno",
        description: "Ocorreu um erro ao criar o aluno.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchStudents();
      toast({
        title: "Aluno excluído",
        description: "O aluno foi excluído com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: "Erro ao excluir aluno",
        description: "Ocorreu um erro ao excluir o aluno.",
        variant: "destructive",
      });
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Alunos</h1>
          <p className="text-muted-foreground">
            Gerencie os alunos do sistema
          </p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Criar Novo Aluno</h2>
          <div className="flex gap-4">
            <Input
              placeholder="Nome do aluno"
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              className="max-w-md"
            />
            <Button onClick={handleCreateStudent}>Salvar</Button>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Gerenciar Alunos</h2>
          
          <div className="mb-4">
            <Input
              placeholder="Buscar por nome..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Data de Nascimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{new Date(student.birthDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        student.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {student.status === "active" ? "Ativo" : "Inativo"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteStudent(student.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Nenhum aluno encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentsTotal;