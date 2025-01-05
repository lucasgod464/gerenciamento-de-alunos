import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { School } from "lucide-react";

interface GeneralStatsProps {
  averageAttendance: number;
  totalStudents: number;
  totalRooms: number;
}

export const GeneralStats = ({ 
  averageAttendance, 
  totalStudents, 
  totalRooms 
}: GeneralStatsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <School className="h-5 w-5 text-muted-foreground" />
          Resumo Geral
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-700">Taxa de Presença</h3>
            <p className="text-2xl font-bold text-green-600">
              {averageAttendance ? `${Math.round(averageAttendance)}%` : 'N/A'}
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-700">Total de Alunos</h3>
            <p className="text-2xl font-bold text-blue-600">{totalStudents}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold text-purple-700">Salas Ativas</h3>
            <p className="text-2xl font-bold text-purple-600">{totalRooms}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};