import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { UserStats } from "@/components/users/UserStats";
import { RoomStats } from "@/components/rooms/RoomStats";
import { StudyStats } from "@/components/studies/StudyStats";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { CustomFieldsChart } from "@/components/admin/dashboard/CustomFieldsChart";
import { useEffect, useState } from "react";
import { Room } from "@/types/room";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        if (!user?.companyId) return;

        const { data, error } = await supabase
          .from('rooms')
          .select('*')
          .eq('company_id', user.companyId);

        if (error) throw error;

        if (data) {
          const mappedRooms = data.map(room => ({
            id: room.id,
            name: room.name,
            schedule: room.schedule,
            location: room.location,
            category: room.category,
            status: room.status,
            companyId: room.company_id || '',
            studyRoom: room.study_room || '',
            createdAt: room.created_at
          }));
          setRooms(mappedRooms);
        }
      } catch (error) {
        console.error('Erro ao carregar salas:', error);
        toast({
          title: "Erro ao carregar salas",
          description: "Não foi possível carregar as informações das salas.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, [user?.companyId, toast]);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Dashboard do Administrador</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao painel de controle administrativo
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <UserStats totalUsers={0} activeUsers={0} inactiveUsers={0} />
          <RoomStats rooms={rooms} />
          <StudyStats totalStudies={0} activeStudies={0} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <CustomFieldsChart />
        </div>

        <DashboardTabs />
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;