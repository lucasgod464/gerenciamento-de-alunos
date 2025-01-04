import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Student, mapSupabaseStudentToStudent, SupabaseStudent } from "@/types/student";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { user: currentUser } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const { toast } = useToast();

  const loadStudents = async () => {
    try {
      console.log("Iniciando busca de alunos...");
      console.log("Company ID do usuário:", currentUser?.companyId);
      
      const { data: studentsData, error } = await supabase
        .from('students')
        .select(`
          *,
          room_students (
            room_id
          )
        `)
        .eq('company_id', currentUser?.companyId);

      if (error) {
        throw error;
      }

      console.log("Dados brutos dos alunos:", studentsData);

      const mappedStudents = studentsData.map(student => 
        mapSupabaseStudentToStudent(student as SupabaseStudent)
      );
      
      console.log("Alunos mapeados:", mappedStudents);
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

  const loadUsers = async () => {
    try {
      const { data: usersData, error } = await supabase
        .from('emails')
        .select('*');

      if (error) throw error;

      setUsers(usersData);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de usuários.",
        variant: "destructive",
      });
    }
  };

  const loadRooms = async () => {
    try {
      const { data: roomsData, error } = await supabase
        .from('rooms')
        .select('*');

      if (error) throw error;

      setRooms(roomsData);
    } catch (error) {
      console.error('Erro ao carregar salas:', error);
      toast({
        title: "Erro ao carregar salas",
        description: "Não foi possível carregar a lista de salas.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (currentUser?.companyId) {
      loadStudents();
      loadUsers();
      loadRooms();
    }
  }, [currentUser?.companyId]);

  const userStats = {
    totalUsers: users.length,
    activeUsers: users.filter(user => user.status === 'active').length,
    inactiveUsers: users.filter(user => user.status !== 'active').length
  };

  const roomStats = {
    rooms,
    activeRooms: rooms.filter(room => room.status).length,
    inactiveRooms: rooms.filter(room => !room.status).length,
    totalRooms: rooms.length
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div>
          <h2 className="text-xl">Estatísticas de Usuários</h2>
          <p>Total de Usuários: {userStats.totalUsers}</p>
          <p>Usuários Ativos: {userStats.activeUsers}</p>
          <p>Usuários Inativos: {userStats.inactiveUsers}</p>
        </div>
        <div>
          <h2 className="text-xl">Estatísticas de Salas</h2>
          <p>Total de Salas: {roomStats.totalRooms}</p>
          <p>Salas Ativas: {roomStats.activeRooms}</p>
          <p>Salas Inativas: {roomStats.inactiveRooms}</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
