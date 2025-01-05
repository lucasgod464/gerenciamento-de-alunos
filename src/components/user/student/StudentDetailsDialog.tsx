import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Student } from "@/types/student";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StudentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentDetailsDialog({ open, onOpenChange }: StudentDetailsDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [attendanceData, setAttendanceData] = useState<any[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .ilike("name", `%${searchTerm}%`);

      if (!error && data) {
        setStudents(data);
      }
    };

    if (searchTerm.length >= 3) {
      fetchStudents();
    }
  }, [searchTerm]);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (!selectedStudent) return;

      const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

      const { data, error } = await supabase
        .from("daily_attendance")
        .select("*")
        .eq("student_id", selectedStudent.id)
        .gte("date", startOfMonth.toISOString())
        .lte("date", endOfMonth.toISOString());

      if (!error && data) {
        setAttendanceData(data);
      }
    };

    fetchAttendanceData();
  }, [selectedStudent, selectedDate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800";
      case "absent":
        return "bg-red-100 text-red-800";
      case "justified":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Consulta Individual de Aluno</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Digite o nome do aluno..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {searchTerm.length >= 3 && students.length > 0 && !selectedStudent && (
            <div className="border rounded-lg p-2 space-y-2">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                  onClick={() => setSelectedStudent(student)}
                >
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(student.birthDate), "dd/MM/yyyy")}
                  </p>
                </div>
              ))}
            </div>
          )}

          {selectedStudent && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Dados do Aluno</h3>
                <p><span className="font-medium">Nome:</span> {selectedStudent.name}</p>
                <p>
                  <span className="font-medium">Data de Nascimento:</span>{" "}
                  {format(new Date(selectedStudent.birthDate), "dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <Badge variant={selectedStudent.status ? "default" : "destructive"}>
                    {selectedStudent.status ? "Ativo" : "Inativo"}
                  </Badge>
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Relatório de Presença</h3>
                <div className="flex gap-6">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="border rounded-md"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">
                      {format(selectedDate, "MMMM 'de' yyyy", { locale: ptBR })}
                    </h4>
                    <div className="space-y-2">
                      {attendanceData.map((attendance) => (
                        <div
                          key={attendance.id}
                          className="flex justify-between items-center p-2 border rounded"
                        >
                          <span>
                            {format(new Date(attendance.date), "dd/MM/yyyy")}
                          </span>
                          <Badge className={getStatusColor(attendance.status)}>
                            {attendance.status === "present"
                              ? "Presente"
                              : attendance.status === "absent"
                              ? "Ausente"
                              : "Justificado"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}