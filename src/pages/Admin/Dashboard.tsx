import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { UserStats } from "@/components/users/UserStats";
import { RoomStats } from "@/components/rooms/RoomStats";
import { StudyStats } from "@/components/studies/StudyStats";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { Room } from "@/types/room";

const AdminDashboard = () => {
  const { user: currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalRooms: 0,
    activeRooms: 0,
    totalStudies: 0,
    activeStudies: 0,
  });
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    if (!currentUser?.companyId) return;

    // Load users stats
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const companyUsers = allUsers.filter((user: any) => user.companyId === currentUser.companyId);
    const activeUsers = companyUsers.filter((user: any) => user.status === "active");

    // Load rooms stats
    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    const companyRooms = allRooms.filter((room: any) => room.companyId === currentUser.companyId);
    const activeRooms = companyRooms.filter((room: any) => room.status);
    setRooms(companyRooms);

    // Load studies stats
    const allStudies = JSON.parse(localStorage.getItem("studies") || "[]");
    const companyStudies = allStudies.filter((study: any) => study.companyId === currentUser.companyId);
    const activeStudies = companyStudies.filter((study: any) => study.status);

    setStats({
      totalUsers: companyUsers.length,
      activeUsers: activeUsers.length,
      totalRooms: companyRooms.length,
      activeRooms: activeRooms.length,
      totalStudies: companyStudies.length,
      activeStudies: activeStudies.length,
    });
  }, [currentUser]);

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
          <UserStats totalUsers={stats.totalUsers} activeUsers={stats.activeUsers} />
          <RoomStats rooms={rooms} totalRooms={stats.totalRooms} activeRooms={stats.activeRooms} />
          <StudyStats totalStudies={stats.totalStudies} activeStudies={stats.activeStudies} />
        </div>

        <DashboardTabs />
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;