import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Student } from "@/types/student";
import { formatDate } from "@/utils/dateUtils";
import { StudentSearch } from "./details/StudentSearch";
import { StudentBasicInfo } from "./details/StudentBasicInfo";
import { AttendanceStats } from "./details/AttendanceStats";
import { AttendanceList } from "./details/AttendanceList";
import { DateRangeFilter } from "../reports/DateRangeFilter";
import { addMonths, startOfMonth, endOfMonth } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface StudentDetailsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function StudentDetailsDialog({ open, onClose }: StudentDetailsDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [dateRange, setDateRange] = useState({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date())
  });
  const [attendance, setAttendance] = useState<any[]>([]);
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    justified: 0
  });
  const { toast } = useToast();

  // Buscar alunos quando o termo de pesquisa mudar
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        if (searchTerm.length < 3) {
          setStudents([]);
          return;
        }

        console.log('Buscando alunos com termo:', searchTerm);

        const { data: studentsData, error } = await supabase
          .from('students')
          .select('*')
          .ilike('name', `%${searchTerm}%`)
          .limit(5);

        if (error) throw error;

        if (studentsData) {
          console.log('Alunos encontrados:', studentsData);
          
          const mappedStudents = studentsData.map(student => ({
            id: student.id,
            name: student.name,
            birthDate: student.birth_date,
            status: student.status,
            email: student.email || '',
            document: student.document || '',
            address: student.address || '',
            customFields: student.custom_fields || {},
            companyId: student.company_id,
            createdAt: student.created_at
          }));

          setStudents(mappedStudents);
        }
      } catch (error) {
        console.error('Erro ao buscar alunos:', error);
        toast({
          title: "Erro ao buscar alunos",
          description: "Não foi possível carregar a lista de alunos.",
          variant: "destructive"
        });
      }
    };

    const debounceTimeout = setTimeout(() => {
      fetchStudents();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm, toast]);

  // Buscar presenças quando o aluno ou período mudar
  useEffect(() => {
    const fetchAttendance = async () => {
      if (!selectedStudent || !dateRange.start || !dateRange.end) return;

      try {
        const { data, error } = await supabase
          .from('daily_attendance')
          .select('*')
          .eq('student_id', selectedStudent.id)
          .gte('date', formatDate(dateRange.start))
          .lte('date', formatDate(dateRange.end));

        if (error) throw error;

        setAttendance(data || []);

        // Calcular estatísticas
        const newStats = (data || []).reduce((acc, record) => {
          acc[record.status] = (acc[record.status] || 0) + 1;
          return acc;
        }, {
          present: 0,
          absent: 0,
          late: 0,
          justified: 0
        });

        setStats(newStats);
      } catch (error) {
        console.error('Erro ao buscar presenças:', error);
        toast({
          title: "Erro ao carregar presenças",
          description: "Não foi possível carregar os dados de presença.",
          variant: "destructive"
        });
      }
    };

    fetchAttendance();
  }, [selectedStudent, dateRange, toast]);

  const handleDateRangeChange = (newRange: { start: Date; end: Date }) => {
    setDateRange(newRange);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Consulta Individual de Aluno</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <StudentSearch
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              students={students}
              onSelectStudent={setSelectedStudent}
              selectedStudent={selectedStudent}
            />

            {searchTerm.length >= 3 && students.length > 0 && !selectedStudent && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <div className="font-medium">{student.name}</div>
                    {student.document && (
                      <div className="text-sm text-gray-500">
                        Documento: {student.document}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedStudent && (
            <div className="space-y-4">
              <StudentBasicInfo student={selectedStudent} />
              
              <DateRangeFilter
                dateRange={dateRange}
                onDateRangeChange={handleDateRangeChange}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AttendanceStats 
                  stats={stats}
                  period={dateRange}
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