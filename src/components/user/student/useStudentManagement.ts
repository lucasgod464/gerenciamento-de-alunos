import { useState, useEffect } from "react";
import { Student } from "@/types/student";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useStudentManagement = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("all");
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  const loadStudents = async () => {
    if (!currentUser?.companyId) return;
    
    try {
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select(`
          *,
          room_students(room_id)
        `)
        .eq('company_id', currentUser.companyId);

      if (studentsError) throw studentsError;

      const mappedStudents = (studentsData || []).map(student => ({
        id: student.id,
        name: student.name,
        birthDate: student.birth_date,
        status: student.status,
        email: student.email,
        document: student.document,
        address: student.address,
        customFields: student.custom_fields,
        companyId: student.company_id,
        createdAt: student.created_at,
        room: student.room_students?.[0]?.room_id
      }));
      
      setStudents(mappedStudents);
    } catch (error) {
      console.error('Error loading students:', error);
      toast({
        title: "Erro ao carregar alunos",
        description: "Não foi possível carregar a lista de alunos.",
        variant: "destructive",
      });
    }
  };

  const handleAddStudent = async (newStudent: Student) => {
    try {
      // Insert student data
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .insert({
          name: newStudent.name,
          birth_date: newStudent.birthDate,
          status: newStudent.status,
          email: newStudent.email,
          document: newStudent.document,
          address: newStudent.address,
          custom_fields: newStudent.customFields,
          company_id: currentUser?.companyId
        })
        .select()
        .single();

      if (studentError) throw studentError;

      // If a room is selected, create room assignment
      if (newStudent.room) {
        const { error: roomError } = await supabase
          .from('room_students')
          .insert({
            student_id: studentData.id,
            room_id: newStudent.room
          });

        if (roomError) throw roomError;
      }

      toast({
        title: "Sucesso",
        description: "Aluno cadastrado com sucesso!",
      });

      loadStudents(); // Reload the students list
    } catch (error) {
      console.error('Error adding student:', error);
      toast({
        title: "Erro ao cadastrar aluno",
        description: "Não foi possível cadastrar o aluno.",
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
        description: "Aluno excluído com sucesso!",
      });
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: "Erro ao excluir aluno",
        description: "Não foi possível excluir o aluno.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStudent = async (updatedStudent: Student) => {
    try {
      // Update student data
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

      // Update room assignment if room has changed
      if (updatedStudent.room) {
        // Remove existing room assignment
        await supabase
          .from('room_students')
          .delete()
          .eq('student_id', updatedStudent.id);

        // Add new room assignment
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

      loadStudents(); // Reload the students list
    } catch (error) {
      console.error('Error updating student:', error);
      toast({
        title: "Erro ao atualizar aluno",
        description: "Não foi possível atualizar o aluno.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (currentUser?.companyId) {
      loadStudents();
    }
  }, [currentUser]);

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name
      ? student.name.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    const matchesRoom = selectedRoom === "all" || student.room === selectedRoom;
    return matchesSearch && matchesRoom;
  });

  return {
    students: filteredStudents,
    rooms,
    searchTerm,
    setSearchTerm,
    selectedRoom,
    setSelectedRoom,
    handleAddStudent,
    handleDeleteStudent,
    handleUpdateStudent,
  };
};