import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CircleCheck, CircleX, Clock, FileQuestion } from "lucide-react";

interface AttendanceDetailsProps {
  studentId: string;
  startDate: Date;
  endDate: Date;
}

interface AttendanceStats {
  present: number;
  absent: number;
  late: number;
  justified: number;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "present":
      return <CircleCheck className="h-4 w-4 text-green-500" />;
    case "absent":
      return <CircleX className="h-4 w-4 text-red-500" />;
    case "late":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "justified":
      return <FileQuestion className="h-4 w-4 text-blue-500" />;
    default:
      return null;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "present":
      return "Presente";
    case "absent":
      return "Ausente";
    case "late":
      return "Atrasado";
    case "justified":
      return "Justificado";
    default:
      return status;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "present":
      return "text-green-600";
    case "absent":
      return "text-red-600";
    case "late":
      return "text-yellow-600";
    case "justified":
      return "text-blue-600";
    default:
      return "text-gray-600";
  }
};

export function AttendanceDetails({ studentId, startDate, endDate }: AttendanceDetailsProps) {
  const [stats, setStats] = useState<AttendanceStats>({
    present: 0,
    absent: 0,
    late: 0,
    justified: 0
  });
  const [attendance, setAttendance] = useState<any[]>([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      const { data, error } = await supabase
        .from('daily_attendance')
        .select('*')
        .eq('student_id', studentId)
        .gte('date', format(startDate, 'yyyy-MM-dd'))
        .lte('date', format(endDate, 'yyyy-MM-dd'))
        .order('date', { ascending: true });

      if (error) {
        console.error('Erro ao buscar presenças:', error);
        return;
      }

      setAttendance(data || []);

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
    };

    fetchAttendance();
  }, [studentId, startDate, endDate]);

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h4 className="font-medium mb-2">
          Resumo do Período ({format(startDate, "dd/MM/yyyy", { locale: ptBR })} - {format(endDate, "dd/MM/yyyy", { locale: ptBR })})
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-green-100 text-green-800 p-2 rounded-md">
            <p className="text-sm">Presentes</p>
            <p className="text-lg font-bold">{stats.present}</p>
          </div>
          <div className="bg-red-100 text-red-800 p-2 rounded-md">
            <p className="text-sm">Faltas</p>
            <p className="text-lg font-bold">{stats.absent}</p>
          </div>
          <div className="bg-yellow-100 text-yellow-800 p-2 rounded-md">
            <p className="text-sm">Atrasos</p>
            <p className="text-lg font-bold">{stats.late}</p>
          </div>
          <div className="bg-blue-100 text-blue-800 p-2 rounded-md">
            <p className="text-sm">Justificadas</p>
            <p className="text-lg font-bold">{stats.justified}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h4 className="font-medium mb-2">Histórico de Presenças</h4>
        <div className="space-y-2">
          {attendance.map((record) => (
            <div
              key={record.id}
              className="flex justify-between items-center p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <span>{format(new Date(record.date), "dd/MM/yyyy", { locale: ptBR })}</span>
                <span className="text-gray-500">→</span>
                <span>{format(addDays(new Date(record.date), 1), "dd/MM/yyyy", { locale: ptBR })}</span>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(record.status)}
                <span className={`font-medium ${getStatusColor(record.status)}`}>
                  {getStatusText(record.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}