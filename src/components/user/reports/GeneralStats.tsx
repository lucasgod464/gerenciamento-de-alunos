import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, School, Percent } from "lucide-react";

interface GeneralStatsProps {
  totalStudents: number;
  totalRooms: number;
  averageAttendance: number;
}

export const GeneralStats = ({ 
  totalStudents, 
  totalRooms, 
  averageAttendance 
}: GeneralStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Alunos
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStudents}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Salas
          </CardTitle>
          <School className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRooms}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Média de Presença
          </CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.round(averageAttendance)}%
          </div>
        </CardContent>
      </Card>
    </div>
  );
};