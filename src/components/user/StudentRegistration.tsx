import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddStudentDialog } from "./AddStudentDialog";
import { StudentTable } from "./StudentTable";
import { StudentFilters } from "./student/StudentFilters";
import { useAuth } from "@/hooks/useAuth";
import { Student } from "@/types/student";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const StudentRegistration = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const { toast } = useToast();

  const loadStudents = async () => {
    if (!user?.companyId) return;

    try {
      const { data: studentsData, error } = await supabase
        .from('students')
        .select(`
          *,
          room_students (
            room_id
          )
        `)
        .eq('company_id', user.companyId);

      if (error) throw error;

      const mappedStudents = studentsData.map(student => ({
        id: student.id,
        name: student.name,
        birthDate: student.birth_date,
        status: student.status ?? true,
        email: student.email || '',
        document: student.document || '',
        address: student.address || '',
        customFields: student.custom_fields || {},
        companyId: student.company_id,
        createdAt: student.created_at,
        room: student.room_students?.[0]?.room_id || null
      }));

      setStudents(mappedStudents);
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
      toast({
        title: "Erro ao carregar alunos",
        description: "Não foi possível carregar a lista de alunos.",
        variant: "destructive",
      });
    }
  };

  const loadRooms = async () => {
    if (!user?.companyId) return;

    try {
      const { data: roomsData, error } = await supabase
        .from('rooms')
        .select('id, name')
        .eq('company_id', user.companyId)
        .eq('status', true);

      if (error) throw error;
      setRooms(roomsData);
    } catch (error) {
      console.error('Erro ao carregar salas:', error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadStudents();
      loadRooms();
    }
  }, [user?.id]);

  const handleAddStudent = async (student: Student) => {
    try {
      const { data: newStudent, error: studentError } = await supabase
        .from('students')
        .insert([{
          name: student.name,
          birth_date: student.birthDate,
          email: student.email,
          document: student.document,
          address: student.address,
          custom_fields: student.customFields,
          company_id: user?.companyId,
          status: true
        }])
        .select()
        .single();

      if (studentError) throw studentError;

      if (student.room) {
        const { error: roomError } = await supabase
          .from('room_students')
          .insert([{
            student_id: newStudent.id,
            room_id: student.room
          }]);

        if (roomError) throw roomError;
      }

      const mappedStudent = {
        ...student,
        id: newStudent.id,
        companyId: newStudent.company_id,
        createdAt: newStudent.created_at,
      };

      setStudents(prev => [...prev, mappedStudent]);
      toast({
        title: "Sucesso",
        description: "Aluno adicionado com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao adicionar aluno:', error);
      toast({
        title: "Erro ao adicionar aluno",
        description: "Não foi possível adicionar o aluno.",
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

      setStudents(prev => prev.filter(student => student.id !== id));
      toast({
        title: "Sucesso",
        description: "Aluno removido com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao deletar aluno:', error);
      toast({
        title: "Erro ao remover aluno",
        description: "Não foi possível remover o aluno.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStudent = async (updatedStudent: Student) => {
    try {
      const { error: studentError } = await supabase
        .from('students')
        .update({
          name: updatedStudent.name,
          birth_date: updatedStudent.birthDate,
          status: updatedStudent.status,
          email: updatedStudent.email,
          document: updatedStudent.document,
          address: updatedStudent.address,
          custom_fields: updatedStudent.customFields
        })
        .eq('id', updatedStudent.id);

      if (studentError) throw studentError;

      // Atualiza a sala do aluno
      await supabase
        .from('room_students')
        .delete()
        .eq('student_id', updatedStudent.id);

      if (updatedStudent.room) {
        const { error: roomError } = await supabase
          .from('room_students')
          .insert({
            student_id: updatedStudent.id,
            room_id: updatedStudent.room
          });

        if (roomError) throw roomError;
      }

      setStudents(prev => prev.map(student => 
        student.id === updatedStudent.id ? updatedStudent : student
      ));

      toast({
        title: "Sucesso",
        description: "Aluno atualizado com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao atualizar aluno:', error);
      toast({
        title: "Erro ao atualizar aluno",
        description: "Não foi possível atualizar o aluno.",
        variant: "destructive",
      });
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRoom = !selectedRoom || student.room === selectedRoom;
    return matchesSearch && matchesRoom;
  });

  const studentsWithRoom = filteredStudents.filter(student => student.room);
  const studentsWithoutRoom = filteredStudents.filter(student => !student.room);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <StudentFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedRoom={selectedRoom}
          onRoomChange={setSelectedRoom}
          rooms={rooms}
        />
        <AddStudentDialog onStudentAdded={handleAddStudent} />
      </div>

      <Tabs defaultValue="without-room" className="space-y-4">
        <TabsList>
          <TabsTrigger value="without-room">
            Alunos sem Sala ({studentsWithoutRoom.length})
          </TabsTrigger>
          <TabsTrigger value="with-room">
            Alunos com Sala ({studentsWithRoom.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="without-room">
          <StudentTable
            students={studentsWithoutRoom}
            rooms={rooms}
            onDeleteStudent={handleDeleteStudent}
            onUpdateStudent={handleUpdateStudent}
          />
        </TabsContent>

        <TabsContent value="with-room">
          <StudentTable
            students={studentsWithRoom}
            rooms={rooms}
            onDeleteStudent={handleDeleteStudent}
            onUpdateStudent={handleUpdateStudent}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};