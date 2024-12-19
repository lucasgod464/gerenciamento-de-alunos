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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Textarea } from "@/components/ui/textarea";

interface Student {
  id: string;
  name: string;
  room: string;
  status: "present" | "absent" | "late" | "justified";
}

interface DailyObservation {
  date: string;
  text: string;
}

export const AttendanceControl = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [observation, setObservation] = useState("");
  const [observations, setObservations] = useState<DailyObservation[]>([]);
  
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
    setStudents(mockStudents);
    
    // Load observation for selected date
    const dateStr = selectedDate?.toISOString().split('T')[0];
    const existingObservation = observations.find(obs => obs.date === dateStr);
    setObservation(existingObservation?.text || "");
  }, [selectedDate]);

  const handleStatusChange = (studentId: string, status: Student["status"]) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === studentId ? { ...student, status } : student
      )
    );
    
    toast({
      title: "Status atualizado",
      description: "O status de presença foi atualizado com sucesso."
    });
  };

  const handleObservationChange = (text: string) => {
    if (text.length <= 100) {
      setObservation(text);
      const dateStr = selectedDate?.toISOString().split('T')[0];
      
      if (dateStr) {
        setObservations(prev => {
          const filtered = prev.filter(obs => obs.date !== dateStr);
          return [...filtered, { date: dateStr, text }];
        });
      }
    }
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
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Sala</TableHead>
                  <TableHead>Status</TableHead>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="space-y-2">
              <CardTitle className="text-lg">Observações do dia</CardTitle>
              <Textarea
                value={observation}
                onChange={(e) => handleObservationChange(e.target.value)}
                placeholder="Digite suas observações para este dia (máximo 100 caracteres)"
                maxLength={100}
                className="min-h-[100px]"
              />
              <p className="text-sm text-muted-foreground text-right">
                {observation.length}/100 caracteres
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};