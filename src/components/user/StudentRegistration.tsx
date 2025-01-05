import { useState } from "react";
import { AddStudentDialog } from "./AddStudentDialog";
import { StudentTable } from "./StudentTable";
import { StudentFilters } from "./student/StudentFilters";
import { useStudentData } from "./student/hooks/useStudentData";
import { Student } from "@/types/student";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export const StudentRegistration = () => {
  const { students, rooms, loadStudents } = useStudentData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const { toast } = useToast();
  const { user } = useAuth();

  const handleAddStudent = async (student: Student) => {
    try {
      if (!user?.companyId) {
        throw new Error("Usuário não está vinculado a uma empresa");
      }

      const { data: newStudent, error: studentError } = await supabase
        .from('students')
        .insert([{
          name: student.name,
          birth_date: student.birthDate,
          email: student.email,
          document: student.document,
          address: student.address,
          custom_fields: student.customFields,
          company_id: user.companyId,
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

      toast({
        title: "Sucesso",
        description: "Aluno adicionado com sucesso!",
      });
      
      loadStudents();
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
      // Primeiro, remover todas as referências em outras tabelas
      await supabase
        .from('room_students')
        .delete()
        .eq('student_id', id);

      await supabase
        .from('daily_attendance')
        .delete()
        .eq('student_id', id);

      await supabase
        .from('daily_observations')
        .delete()
        .eq('student_id', id);

      // Por fim, remover o aluno
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Aluno removido com sucesso!",
      });
      
      loadStudents();
    } catch (error) {
      console.error('Erro ao deletar aluno:', error);
      toast({
        title: "Erro ao remover aluno",
        description: "Não foi possível remover o aluno.",
        variant: "destructive",
      });
    }
  };

  const handleTransferStudent = async (studentId: string, newRoomId: string) => {
    try {
      await supabase
        .from('room_students')
        .delete()
        .eq('student_id', studentId);

      const { error } = await supabase
        .from('room_students')
        .insert({
          student_id: studentId,
          room_id: newRoomId
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Aluno transferido com sucesso!",
      });
      
      loadStudents();
    } catch (error) {
      console.error('Erro ao transferir aluno:', error);
      toast({
        title: "Erro ao transferir aluno",
        description: "Não foi possível transferir o aluno.",
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

      if (updatedStudent.room) {
        await supabase
          .from('room_students')
          .delete()
          .eq('student_id', updatedStudent.id);

        const { error: roomError } = await supabase
          .from('room_students')
          .insert({
            student_id: updatedStudent.id,
            room_id: updatedStudent.room
          });

        if (roomError) throw roomError;
      }

      toast({
        title: "Sucesso",
        description: "Aluno atualizado com sucesso!",
      });
      
      loadStudents();
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

      <StudentTable
        students={filteredStudents}
        rooms={rooms}
        onDeleteStudent={handleDeleteStudent}
        onTransferStudent={handleTransferStudent}
        onUpdateStudent={handleUpdateStudent}
      />
    </div>
  );
};