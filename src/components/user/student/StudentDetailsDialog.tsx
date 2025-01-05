import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Student } from "@/types/student";
import { formatDate } from "@/utils/dateUtils";

interface StudentDetailsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function StudentDetailsDialog({ open, onClose }: StudentDetailsDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [attendance, setAttendance] = useState<any[]>([]);

  // Buscar alunos baseado no termo de busca
  useEffect(() => {
    const fetchStudents = async () => {
      if (searchTerm.length < 3) return;

      const { data, error } = await supabase
        .from('students')
        .select('*')
        .ilike('name', `%${searchTerm}%`)
        .limit(5);

      if (error) {
        console.error('Erro ao buscar alunos:', error);
        return;
      }

      setStudents(data || []);
    };

    fetchStudents();
  }, [searchTerm]);

  // Buscar dados de presença do aluno selecionado
  useEffect(() => {
    const fetchAttendance = async () => {
      if (!selectedStudent) return;

      const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

      const { data, error } = await supabase
        .from('daily_attendance')
        .select('*')
        .eq('student_id', selectedStudent.id)
        .gte('date', formatDate(startOfMonth))
        .lte('date', formatDate(endOfMonth));

      if (error) {
        console.error('Erro ao buscar presenças:', error);
        return;
      }

      setAttendance(data || []);
    };

    fetchAttendance();
  }, [selectedStudent, selectedDate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Consulta Individual de Aluno</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Busca de aluno */}
          <div>
            <Input
              placeholder="Digite o nome do aluno..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            {searchTerm.length >= 3 && students.length > 0 && !selectedStudent && (
              <div className="mt-2 border rounded-md divide-y">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="p-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedStudent(student)}
                  >
                    {student.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detalhes do aluno selecionado */}
          {selectedStudent && (
            <div className="space-y-6">
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Dados do Aluno</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Nome:</span> {selectedStudent.name}</p>
                  <p><span className="font-medium">Data de Nascimento:</span> {selectedStudent.birthDate}</p>
                  {selectedStudent.email && (
                    <p><span className="font-medium">Email:</span> {selectedStudent.email}</p>
                  )}
                </div>
              </Card>

              <div>
                <h3 className="font-semibold mb-2">Calendário de Presenças</h3>
                <div className="flex gap-6">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border"
                  />
                  
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">Registro do Mês</h4>
                    <div className="space-y-2">
                      {attendance.map((record) => (
                        <div
                          key={record.id}
                          className={`px-3 py-2 rounded-md ${getStatusColor(record.status)}`}
                        >
                          {new Date(record.date).toLocaleDateString('pt-BR')}: {record.status}
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