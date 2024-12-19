import { useState, useEffect } from "react";
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
import { Check, X } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface Student {
  id: string;
  name: string;
  room: string;
  status: "present" | "absent" | "late" | "justified";
}

export const AttendanceControl = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  
  // Mock data - replace with actual data from your backend
  const mockStudents: Student[] = [
    { id: "1", name: "João Silva", room: "Sala 1", status: "present" },
    { id: "2", name: "Maria Santos", room: "Sala 1", status: "absent" },
    { id: "3", name: "Pedro Oliveira", room: "Sala 2", status: "late" },
    { id: "4", name: "Ana Souza", room: "Sala 1", status: "present" },
    { id: "5", name: "Lucas Ferreira", room: "Sala 2", status: "absent" },
  ];

  useEffect(() => {
    // Simulate loading data for the selected date
    // Replace this with actual API call
    setStudents(mockStudents);
  }, [selectedDate]);

  const handleStatusChange = (studentId: string, status: Student["status"]) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === studentId ? { ...student, status } : student
      )
    );
    
    toast({
      title: "Presença atualizada",
      description: "O status de presença foi atualizado com sucesso."
    });
  };

  // Calculate attendance statistics for pie chart
  const getAttendanceStats = () => {
    const stats = students.reduce(
      (acc, student) => {
        if (student.status === "present") acc.present += 1;
        else if (student.status === "absent") acc.absent += 1;
        else if (student.status === "late") acc.late += 1;
        else if (student.status === "justified") acc.justified += 1;
        return acc;
      },
      { present: 0, absent: 0, late: 0, justified: 0 }
    );

    return [
      { name: "Presentes", value: stats.present, color: "#22c55e" },
      { name: "Ausentes", value: stats.absent, color: "#ef4444" },
      { name: "Atrasados", value: stats.late, color: "#f59e0b" },
      { name: "Justificados", value: stats.justified, color: "#3b82f6" },
    ];
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
            <CardTitle>Estatísticas de Presença</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getAttendanceStats()}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {getAttendanceStats().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Lista de Presença - {selectedDate?.toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </CardTitle>
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