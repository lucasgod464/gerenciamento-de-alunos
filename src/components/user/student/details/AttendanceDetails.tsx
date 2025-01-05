import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays, subYears } from "date-fns";
import { AttendanceStats } from "./attendance/AttendanceStats";
import { AttendanceHistory } from "./attendance/AttendanceHistory";
import { PeriodSelector } from "./attendance/PeriodSelector";

interface AttendanceStats {
  present: number;
  absent: number;
  late: number;
  justified: number;
}

export function AttendanceDetails({ studentId }: { studentId: string }) {
  const today = new Date();
  const [dateRange, setDateRange] = useState({
    startDate: subDays(today, 29),
    endDate: today
  });
  const [stats, setStats] = useState<AttendanceStats>({
    present: 0,
    absent: 0,
    late: 0,
    justified: 0
  });
  const [attendance, setAttendance] = useState<any[]>([]);

  const handlePeriodChange = (value: string) => {
    const today = new Date();
    switch (value) {
      case "last30days":
        setDateRange({
          startDate: subDays(today, 29),
          endDate: today
        });
        break;
      case "lastYear":
        setDateRange({
          startDate: subYears(today, 1),
          endDate: today
        });
        break;
    }
  };

  useEffect(() => {
    const fetchAttendance = async () => {
      const { data, error } = await supabase
        .from('daily_attendance')
        .select('*')
        .eq('student_id', studentId)
        .gte('date', format(dateRange.startDate, 'yyyy-MM-dd'))
        .lte('date', format(dateRange.endDate, 'yyyy-MM-dd'))
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
  }, [studentId, dateRange]);

  return (
    <div className="space-y-4">
      <PeriodSelector onPeriodChange={handlePeriodChange} />
      <AttendanceStats stats={stats} dateRange={dateRange} />
      <AttendanceHistory attendance={attendance} />
    </div>
  );
}