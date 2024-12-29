import { Building2, School2, Activity, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsProps {
  totalRooms: number;
  activeRooms: number;
  totalCompanies: number;
  totalStudents: number;
}

export function RoomStats({ totalRooms, activeRooms, totalCompanies, totalStudents }: StatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-4">
      <Card className="bg-white shadow-sm border-primary/10 hover:border-primary/30 transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total de Salas</CardTitle>
          <School2 className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRooms}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Em {totalCompanies} empresas
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border-green-500/10 hover:border-green-500/30 transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Salas Ativas</CardTitle>
          <Activity className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeRooms}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {((activeRooms / totalRooms) * 100).toFixed(1)}% do total
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border-orange-500/10 hover:border-orange-500/30 transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Salas Inativas</CardTitle>
          <Building2 className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRooms - activeRooms}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {((totalRooms - activeRooms) / totalRooms * 100).toFixed(1)}% do total
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border-blue-500/10 hover:border-blue-500/30 transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
          <GraduationCap className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStudents}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Média de {(totalStudents / totalRooms || 0).toFixed(1)} por sala
          </p>
        </CardContent>
      </Card>
    </div>
  );
}