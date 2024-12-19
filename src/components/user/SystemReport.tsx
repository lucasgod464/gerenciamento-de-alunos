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
} from "recharts";
import { FileSpreadsheet, Download } from "lucide-react";

// Mock data - replace with real data when connected to backend
const mockAttendanceData = [
  { name: "Janeiro", presenca: 85, faltas: 15 },
  { name: "Fevereiro", presenca: 90, faltas: 10 },
  { name: "Março", presenca: 88, faltas: 12 },
];

const mockStudentData = [
  { sala: "Sala 1", alunos: 25 },
  { sala: "Sala 2", alunos: 30 },
  { sala: "Sala 3", alunos: 28 },
];

export const SystemReport = () => {
  const [reportType, setReportType] = useState("attendance");
  const [timeFrame, setTimeFrame] = useState("month");
  const [room, setRoom] = useState("all");
  const { toast } = useToast();

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

          <Select value={room} onValueChange={setRoom}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sala" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Salas</SelectItem>
              <SelectItem value="sala1">Sala 1</SelectItem>
              <SelectItem value="sala2">Sala 2</SelectItem>
              <SelectItem value="sala3">Sala 3</SelectItem>
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
            <CardTitle>Relatório de Presença</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockAttendanceData}>
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
            <CardTitle>Distribuição de Alunos por Sala</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockStudentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sala" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="alunos" fill="#3b82f6" name="Número de Alunos" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo Geral</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-700">Taxa de Presença</h3>
              <p className="text-2xl font-bold text-green-600">87.6%</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-700">Total de Alunos</h3>
              <p className="text-2xl font-bold text-blue-600">83</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-700">Salas Ativas</h3>
              <p className="text-2xl font-bold text-purple-600">3</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};