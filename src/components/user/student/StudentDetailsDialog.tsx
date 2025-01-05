import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User, Calendar as CalendarIcon } from "lucide-react";
import { Student } from "@/types/student";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface StudentDetailsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function StudentDetailsDialog({ open, onClose }: StudentDetailsDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [attendanceData, setAttendanceData] = useState<any[]>([]);

  const handleSearch = async () => {
    if (searchTerm.length < 3) return;

    const { data, error } = await supabase
      .from("students")
      .select("*")
      .ilike("name", `%${searchTerm}%`);

    if (error) {
      console.error("Erro ao buscar alunos:", error);
      return;
    }

    setStudents(data || []);
  };

  const handleSelectStudent = async (student: Student) => {
    setSelectedStudent(student);
    await fetchAttendanceData(student.id);
  };

  const fetchAttendanceData = async (studentId: string) => {
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const { data, error } = await supabase
      .from("daily_attendance")
      .select("*")
      .eq("student_id", studentId)
      .gte("date", format(startDate, "yyyy-MM-dd"))
      .lte("date", format(endDate, "yyyy-MM-dd"))
      .order("date", { ascending: true });

    if (error) {
      console.error("Erro ao buscar dados de presença:", error);
      return;
    }

    setAttendanceData(data || []);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800";
      case "absent":
        return "bg-red-100 text-red-800";
      case "late":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detalhes do Aluno
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Barra de pesquisa */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar aluno..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button onClick={handleSearch}>Buscar</Button>
          </div>

          {/* Lista de resultados da pesquisa */}
          {!selectedStudent && students.length > 0 && (
            <div className="border rounded-lg divide-y">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="p-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSelectStudent(student)}
                >
                  <p className="font-medium">{student.name}</p>
                </div>
              ))}
            </div>
          )}

          {/* Detalhes do aluno selecionado */}
          {selectedStudent && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">{selectedStudent.name}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Data de Nascimento</p>
                    <p>{format(new Date(selectedStudent.birthDate), "dd/MM/yyyy")}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p>{selectedStudent.email || "Não informado"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Documento</p>
                    <p>{selectedStudent.document || "Não informado"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Endereço</p>
                    <p>{selectedStudent.address || "Não informado"}</p>
                  </div>
                </div>
              </div>

              {/* Calendário e relatório de presença */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <CalendarIcon className="h-5 w-5" />
                    <h3 className="font-semibold">Selecione o Mês</h3>
                  </div>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      if (newDate) {
                        setDate(newDate);
                        fetchAttendanceData(selectedStudent.id);
                      }
                    }}
                    locale={ptBR}
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Relatório de Presença</h3>
                  <div className="space-y-2">
                    {attendanceData.map((record) => (
                      <div
                        key={record.id}
                        className="flex justify-between items-center p-2 rounded-lg border"
                      >
                        <span>
                          {format(new Date(record.date), "dd/MM/yyyy")}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            record.status
                          )}`}
                        >
                          {record.status === "present"
                            ? "Presente"
                            : record.status === "absent"
                            ? "Ausente"
                            : record.status === "late"
                            ? "Atrasado"
                            : "Justificado"}
                        </span>
                      </div>
                    ))}
                    {attendanceData.length === 0 && (
                      <p className="text-center text-gray-500 py-4">
                        Nenhum registro encontrado para o período selecionado
                      </p>
                    )}
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