import { useState, useEffect } from "react";
import { Student, mapSupabaseStudentToStudent } from "@/types/student";
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
      // Fetch rooms first
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('id, name')
        .eq('company_id', currentUser.companyId)
        .eq('status', true);

      if (roomsError) throw roomsError;
      setRooms(roomsData || []);

      // Fetch students with their room assignments
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select(`
          *,
          room_students(room_id)
        `)
        .eq('company_id', currentUser.companyId);

      if (studentsError) throw studentsError;

      const mappedStudents = (studentsData || []).map(mapSupabaseStudentToStudent);
      setStudents(mappedStudents);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar os dados",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadStudents();
  }, [currentUser]);

  const handleAddStudent = async (newStudent: Student) => {
    try {
      // Insert student
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

      // If room is selected, create room assignment
      if (newStudent.room) {
        const { error: roomError } = await supabase
          .from('room_students')
          .insert({
            student_id: studentData.id,
            room_id: newStudent.room
          });

        if (roomError) throw roomError;
      }

      loadStudents();
      toast({
        title: "Sucesso",
        description: "Aluno cadastrado com sucesso!",
      });
    } catch (error) {
      console.error('Error adding student:', error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar aluno",
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

      loadStudents();
      toast({
        title: "Sucesso",
        description: "Aluno excluído com sucesso!",
      });
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir aluno",
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

      // Update room assignment
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

      loadStudents();
      toast({
        title: "Sucesso",
        description: "Aluno atualizado com sucesso!",
      });
    } catch (error) {
      console.error('Error updating student:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar aluno",
        variant: "destructive",
      });
    }
  };

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