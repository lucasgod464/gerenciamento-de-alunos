import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Student } from "@/types/student";
import { formatDate } from "@/utils/dateUtils";
import { StudentSearch } from "./details/StudentSearch";
import { StudentBasicInfo } from "./details/StudentBasicInfo";
import { AttendanceStats } from "./details/AttendanceStats";
import { AttendanceList } from "./details/AttendanceList";
import { DateRangeSelector } from "./details/DateRangeSelector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addDays, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek, subDays, subMonths, subWeeks } from "date-fns";
import { ptBR } from "date-fns/locale";

interface StudentDetailsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function StudentDetailsDialog({ open, onClose }: StudentDetailsDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [attendance, setAttendance] = useState<any[]>([]);
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    justified: 0
  });

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

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!selectedStudent) return;

      const { data, error } = await supabase
        .from('daily_attendance')
        .select('*')
        .eq('student_id', selectedStudent.id)
        .gte('date', formatDate(startDate))
        .lte('date', formatDate(endDate));

      if (error) {
        console.error('Erro ao buscar presenças:', error);
        return;
      }

      setAttendance(data || []);

      const stats = (data || []).reduce((acc, record) => {
        acc[record.status] = (acc[record.status] || 0) + 1;
        return acc;
      }, {
        present: 0,
        absent: 0,
        late: 0,
        justified: 0
      });

      setStats(stats);
    };

    if (selectedStudent) {
      fetchAttendance();
    }
  }, [selectedStudent, startDate, endDate]);

  const handlePresetChange = (value: string) => {
    const today = new Date();
    
    switch (value) {
      case "today":
        setStartDate(today);
        setEndDate(today);
        break;
      case "yesterday":
        const yesterday = subDays(today, 1);
        setStartDate(yesterday);
        setEndDate(yesterday);
        break;
      case "last7days":
        setStartDate(subDays(today, 6));
        setEndDate(today);
        break;
      case "last30days":
        setStartDate(subDays(today, 29));
        setEndDate(today);
        break;
      case "thisMonth":
        setStartDate(startOfMonth(today));
        setEndDate(endOfMonth(today));
        break;
      case "lastMonth":
        const lastMonth = subMonths(today, 1);
        setStartDate(startOfMonth(lastMonth));
        setEndDate(endOfMonth(lastMonth));
        break;
      case "thisWeek":
        setStartDate(startOfWeek(today, { locale: ptBR }));
        setEndDate(endOfWeek(today, { locale: ptBR }));
        break;
      case "lastWeek":
        const lastWeek = subWeeks(today, 1);
        setStartDate(startOfWeek(lastWeek, { locale: ptBR }));
        setEndDate(endOfWeek(lastWeek, { locale: ptBR }));
        break;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Consulta Individual de Aluno</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <StudentSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            students={students}
            onSelectStudent={setSelectedStudent}
            selectedStudent={selectedStudent}
          />

          {selectedStudent && (
            <div className="space-y-4">
              <StudentBasicInfo student={selectedStudent} />
              
              <div className="flex gap-4 items-center">
                <Select onValueChange={handlePresetChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Período predefinido" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Hoje</SelectItem>
                    <SelectItem value="yesterday">Ontem</SelectItem>
                    <SelectItem value="last7days">Últimos 7 dias</SelectItem>
                    <SelectItem value="last30days">Últimos 30 dias</SelectItem>
                    <SelectItem value="thisWeek">Esta semana</SelectItem>
                    <SelectItem value="lastWeek">Semana passada</SelectItem>
                    <SelectItem value="thisMonth">Este mês</SelectItem>
                    <SelectItem value="lastMonth">Mês passado</SelectItem>
                  </SelectContent>
                </Select>

                <DateRangeSelector
                  startDate={startDate}
                  endDate={endDate}
                  onDateChange={(start, end) => {
                    setStartDate(start);
                    setEndDate(end);
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AttendanceStats 
                  stats={stats}
                  period={{ start: startDate, end: endDate }}
                />
                <AttendanceList attendance={attendance} />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}