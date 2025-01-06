import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users2, DoorOpen, GraduationCap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function DashboardStats() {
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [
        { count: companiesCount },
        { count: usersCount },
        { count: roomsCount },
        { count: studentsCount },
      ] = await Promise.all([
        supabase.from("companies").select("*", { count: "exact", head: true }),
        supabase.from("emails").select("*", { count: "exact", head: true }),
        supabase.from("rooms").select("*", { count: "exact", head: true }),
        supabase.from("students").select("*", { count: "exact", head: true }),
      ]);

      return {
        companies: companiesCount || 0,
        users: usersCount || 0,
        rooms: roomsCount || 0,
        students: studentsCount || 0,
      };
    },
  });

  const items = [
    {
      title: "Total de Empresas",
      value: stats?.companies || 0,
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total de Usuários",
      value: stats?.users || 0,
      icon: Users2,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total de Salas",
      value: stats?.rooms || 0,
      icon: DoorOpen,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total de Alunos",
      value: stats?.students || 0,
      icon: GraduationCap,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.title}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${item.bgColor}`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {item.title}
                </p>
                <h2 className="text-2xl font-bold">{item.value}</h2>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}