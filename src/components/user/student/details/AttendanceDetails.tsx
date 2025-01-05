import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
              className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
            >
              <span>{format(new Date(record.date), "dd/MM/yyyy", { locale: ptBR })}</span>
              <span className="capitalize">{record.status}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}