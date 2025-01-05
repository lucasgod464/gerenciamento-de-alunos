import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FileSpreadsheet, Download, Users, School, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const SystemReport = () => {
  const [reportType, setReportType] = useState("attendance");
  const [timeFrame, setTimeFrame] = useState("month");
  const { toast } = useToast();
  const { user } = useAuth();

  // Buscar salas autorizadas do usuário
  const { data: authorizedRooms } = useQuery({
    queryKey: ["authorized-rooms", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data: userRooms, error } = await supabase
        .from("user_rooms")
        .select(`
          room_id,
          rooms (
            id,
            name,
            room_students (
              student_id,
              students (*)
            )
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;
      return userRooms?.map(ur => ur.rooms) || [];
    },
  });

  // Buscar dados de presença
  const { data: attendanceData } = useQuery({
    queryKey: ["attendance-data", user?.id, timeFrame],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("daily_attendance")
        .select("*")
        .in("room_id", authorizedRooms?.map(room => room.id) || []);

      if (error) throw error;

      // Agrupar por data
      const groupedData = data.reduce((acc, curr) => {
        const date = new Date(curr.date).toLocaleDateString('pt-BR', { month: 'long' });
        if (!acc[date]) {
          acc[date] = { presenca: 0, faltas: 0, total: 0 };
        }
        if (curr.status === 'present') {
          acc[date].presenca++;
        } else {
          acc[date].faltas++;
        }
        acc[date].total++;
        return acc;
      }, {});

      return Object.entries(groupedData).map(([name, values]) => ({
        name,
        presenca: Math.round((values.presenca / values.total) * 100),
        faltas: Math.round((values.faltas / values.total) * 100),
      }));
    },
  });

  // Calcular estatísticas gerais
  const totalStudents = authorizedRooms?.reduce((acc, room) => 
    acc + (room.room_students?.length || 0), 0) || 0;

  const totalRooms = authorizedRooms?.length || 0;

  const averageAttendance = attendanceData?.reduce((acc, curr) => 
    acc + curr.presenca, 0) / (attendanceData?.length || 1);

  const COLORS = ['#22c55e', '#3b82f6', '#a855f7'];

  const handleExportReport = () => {
    toast({
      title: "Exportando relatório",
      description: "Seu relatório será baixado em breve",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de Relatório" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="attendance">Relatório de Presença</SelectItem>
              <SelectItem value="students">Relatório de Alunos</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Última Semana</SelectItem>
              <SelectItem value="month">Último Mês</SelectItem>
              <SelectItem value="quarter">Último Trimestre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" onClick={handleExportReport}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              Relatório de Presença
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="presenca" fill="#22c55e" name="Presença %" />
                  <Bar dataKey="faltas" fill="#ef4444" name="Faltas %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              Distribuição de Alunos por Sala
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={authorizedRooms?.map(room => ({
                      name: room.name,
                      value: room.room_students?.length || 0
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {authorizedRooms?.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

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
    </div>
  );
};