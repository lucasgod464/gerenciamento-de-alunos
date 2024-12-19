import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Check, X, FileDown } from "lucide-react";

interface Student {
  id: string;
  name: string;
  room: string;
  status: "present" | "absent" | "late" | "justified";
}

export const AttendanceControl = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedRoom, setSelectedRoom] = useState("all");
  const { toast } = useToast();
  
  // Mock data - replace with actual data from your backend
  const students: Student[] = [
    { id: "1", name: "João Silva", room: "Sala 1", status: "present" },
    { id: "2", name: "Maria Santos", room: "Sala 1", status: "absent" },
    { id: "3", name: "Pedro Oliveira", room: "Sala 2", status: "late" },
  ];

  const handleStatusChange = (studentId: string, status: Student["status"]) => {
    // Here you would update the attendance status in your backend
    toast({
      title: "Presença atualizada",
      description: "O status de presença foi atualizado com sucesso."
    });
  };

  const handleExportReport = () => {
    toast({
      title: "Relatório gerado",
      description: "O relatório de presença foi gerado e está sendo baixado."
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Calendário</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a sala" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as salas</SelectItem>
                  <SelectItem value="sala1">Sala 1</SelectItem>
                  <SelectItem value="sala2">Sala 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleExportReport} variant="outline">
              <FileDown className="mr-2 h-4 w-4" />
              Exportar Relatório
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Presença</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Sala</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.room}</TableCell>
                  <TableCell>
                    <Select
                      value={student.status}
                      onValueChange={(value: Student["status"]) =>
                        handleStatusChange(student.id, value)
                      }
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="present">Presente</SelectItem>
                        <SelectItem value="absent">Ausente</SelectItem>
                        <SelectItem value="late">Atrasado</SelectItem>
                        <SelectItem value="justified">Justificado</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStatusChange(student.id, "present")}
                      >
                        <Check className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStatusChange(student.id, "absent")}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};