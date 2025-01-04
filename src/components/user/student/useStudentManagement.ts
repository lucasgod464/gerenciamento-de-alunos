import { useState, useEffect } from "react";
import { Student } from "@/types/student";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export const useStudentManagement = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchStudents = async () => {
    try {
      const { data: studentsData, error } = await supabase
        .from('students')
        .select(`
          *,
          room_students(room_id)
        `)
        .eq('company_id', user?.companyId);

      if (error) throw error;

      const mappedStudents: Student[] = studentsData.map(student => ({
        id: student.id,
        name: student.name,
        birth_date: student.birth_date,
        status: student.status ?? true,
        email: student.email,
        document: student.document,
        address: student.address,
        custom_fields: student.custom_fields ? JSON.parse(JSON.stringify(student.custom_fields)) : {},
        company_id: student.company_id || '',
        created_at: student.created_at,
        room: student.room_students?.[0]?.room_id
      }));
      
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

  const fetchRooms = async () => {
    try {
      const { data: roomsData, error } = await supabase
        .from('rooms')
        .select('id, name')
        .eq('company_id', user?.companyId);

      if (error) throw error;
      setRooms(roomsData);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  useEffect(() => {
    if (user?.companyId) {
      fetchStudents();
      fetchRooms();
    }
  }, [user?.companyId]);

  // Configuração do real-time subscription
  useEffect(() => {
    if (!user?.companyId) return;

    const channel = supabase
      .channel('students_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'students',
          filter: `company_id=eq.${user.companyId}`
        },
        (payload) => {
          console.log('Real-time update:', payload);
          
          if (payload.eventType === 'UPDATE') {
            setStudents(prev => 
              prev.map(student => 
                student.id === payload.new.id 
                  ? {
                      ...student,
                      ...payload.new,
                      custom_fields: payload.new.custom_fields 
                        ? JSON.parse(JSON.stringify(payload.new.custom_fields))
                        : {}
                    }
                  : student
              )
            );
            toast({
              title: "Aluno atualizado",
              description: "As informações do aluno foram atualizadas com sucesso.",
            });
          } else if (payload.eventType === 'DELETE') {
            setStudents(prev => prev.filter(student => student.id !== payload.old.id));
            toast({
              title: "Aluno removido",
              description: "O aluno foi removido com sucesso.",
            });
          } else if (payload.eventType === 'INSERT') {
            setStudents(prev => [...prev, {
              ...payload.new,
              custom_fields: payload.new.custom_fields 
                ? JSON.parse(JSON.stringify(payload.new.custom_fields))
                : {}
            }]);
            toast({
              title: "Novo aluno",
              description: "Um novo aluno foi adicionado.",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.companyId, toast]);

  const handleAddStudent = async (student: Omit<Student, "id" | "created_at">) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert([{ ...student, company_id: user?.companyId }])
        .select()
        .single();

      if (error) throw error;

      if (student.room) {
        const { error: roomError } = await supabase
          .from('room_students')
          .insert({
            student_id: data.id,
            room_id: student.room
          });

        if (roomError) throw roomError;
      }

      toast({
        title: "Sucesso",
        description: "Aluno adicionado com sucesso!",
      });
    } catch (error) {
      console.error('Error adding student:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar aluno",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId);

      if (error) throw error;

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

  const handleUpdateStudent = async (student: Student) => {
    try {
      const { error } = await supabase
        .from('students')
        .update({
          name: student.name,
          birth_date: student.birth_date,
          status: student.status,
          email: student.email,
          document: student.document,
          address: student.address,
          custom_fields: student.custom_fields
        })
        .eq('id', student.id);

      if (error) throw error;

      // Atualiza a sala do aluno
      if (student.room) {
        await supabase
          .from('room_students')
          .delete()
          .eq('student_id', student.id);

        const { error: roomError } = await supabase
          .from('room_students')
          .insert({
            student_id: student.id,
            room_id: student.room
          });

        if (roomError) throw roomError;
      }

      toast({
        title: "Sucesso",
        description: "Dados do aluno atualizados com sucesso!",
      });
    } catch (error) {
      console.error('Error updating student:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar dados do aluno",
        variant: "destructive",
      });
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.document?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRoom = !selectedRoom || student.room === selectedRoom;
    
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