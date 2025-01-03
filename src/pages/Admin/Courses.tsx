import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";
import type { Course } from "@/types/course";

interface Course {
  id: number;
  name: string;
  status: "active" | "inactive";
}

const Courses = () => {
  const [newCourseName, setNewCourseName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const { user } = useAuth();

  const fetchCourses = async () => {
    if (!user?.companyId) return;

    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('company_id', user.companyId);

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: "Erro ao carregar cursos",
        description: "Ocorreu um erro ao carregar os cursos.",
        variant: "destructive",
      });
    }
  };

  const handleCreateCourse = async () => {
    if (!newCourseName.trim() || !user?.companyId) return;
    
    try {
      const { error } = await supabase
        .from('courses')
        .insert([{
          name: newCourseName.trim(),
          status: true,
          company_id: user.companyId
        }]);

      if (error) throw error;
      
      fetchCourses();
      setNewCourseName("");
      toast({
        title: "Curso criado",
        description: "O curso foi criado com sucesso.",
      });
    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: "Erro ao criar curso",
        description: "Ocorreu um erro ao criar o curso.",
        variant: "destructive",
      });
    }
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, name: "Curso de React", status: "active" },
    { id: 2, name: "Treinamento TypeScript", status: "inactive" },
  ]);

  const handleCreateCourse = () => {
    if (!newCourseName.trim()) return;
    
    const newCourse: Course = {
      id: courses.length + 1,
      name: newCourseName.trim(),
      status: "active",
    };
    
    setCourses([...courses, newCourse]);
    setNewCourseName("");
  };

  const handleDeleteCourse = (id: number) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Cursos/Treinamentos</h1>
          <p className="text-muted-foreground">
            Gerencie os cursos e treinamentos do sistema
          </p>
        </div>

        {/* Create Course Form */}
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Criar Novo Curso/Treinamento</h2>
          <div className="flex gap-4">
            <Input
              placeholder="Nome do curso/treinamento"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              className="max-w-md"
            />
            <Button onClick={handleCreateCourse}>Salvar</Button>
          </div>
        </div>

        {/* Manage Courses */}
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Gerenciar Cursos/Treinamentos</h2>
          
          {/* Search Bar */}
          <div className="mb-4">
            <Input
              placeholder="Buscar por nome..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          {/* Courses Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        course.status
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {course.status ? "Ativo" : "Inativo"}
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
                        onClick={() => handleDeleteCourse(course.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Courses;
