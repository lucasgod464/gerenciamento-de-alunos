import { DashboardLayout } from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import { Student } from "@/types/student";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { StudentTable } from "@/components/user/StudentTable";
import { useToast } from "@/hooks/use-toast";

const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user?.id) return;
    fetchAuthorizedStudents();
    fetchUserRooms();
  }, [user]);

  const fetchUserRooms = async () => {
    try {
      const { data: userRooms, error } = await supabase
        .from('user_rooms')
        .select('rooms (id, name)')
        .eq('user_id', user?.id);

      if (error) throw error;

      const mappedRooms = userRooms
        .map(ur => ur.rooms)
        .filter(Boolean)
        .map(room => ({
          id: room.id,
          name: room.name
        }));

      setRooms(mappedRooms);
    } catch (error) {
      console.error('Erro ao buscar salas:', error);
    }
  };

  const fetchAuthorizedStudents = async () => {
    try {
      console.log('Buscando alunos para o usuário:', user?.id);
      
      // Primeiro, buscar as salas autorizadas do usuário
      const { data: userRooms, error: roomsError } = await supabase
        .from('user_rooms')
        .select('room_id')
        .eq('user_id', user?.id);

      if (roomsError) throw roomsError;

      const roomIds = userRooms.map(ur => ur.room_id);
      console.log('IDs das salas autorizadas:', roomIds);

      if (roomIds.length === 0) {
        console.log('Usuário não tem salas autorizadas');
        return;
      }

      // Buscar alunos vinculados a essas salas
      const { data: studentsData, error: studentsError } = await supabase
        .from('room_students')
        .select(`
          student:students (
            id,
            name,
            birth_date,
            status,
            email,
            document,
            address,
            custom_fields,
            company_id,
            created_at
          )
        `)
        .in('room_id', roomIds);

      if (studentsError) throw studentsError;

      console.log('Dados dos alunos:', studentsData);

      const mappedStudents = studentsData
        .map(rs => rs.student)
        .filter(Boolean)
        .map(student => ({
          id: student.id,
          name: student.name,
          birthDate: student.birth_date,
          status: student.status,
          email: student.email || '',
          document: student.document || '',
          address: student.address || '',
          customFields: student.custom_fields || {},
          companyId: student.company_id,
          createdAt: student.created_at,
          room: null // Será preenchido depois
        }));

      setStudents(mappedStudents);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      toast({
        title: "Erro ao carregar alunos",
        description: "Ocorreu um erro ao carregar a lista de alunos.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout role="user">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Meus Alunos</h1>
          <p className="text-muted-foreground">
            Gerencie os alunos das suas salas
          </p>
        </div>

        <StudentTable
          students={students}
          rooms={rooms}
          onDeleteStudent={() => {}}
          showTransferOption={false}
        />
      </div>
    </DashboardLayout>
  );
};

export default StudentsPage;