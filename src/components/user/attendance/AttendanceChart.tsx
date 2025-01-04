import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/utils/dateUtils";

interface AttendanceChartProps {
  date: Date;
  companyId: string;
}

interface ChartData {
  name: string;
  value: number;
}

const COLORS = {
  present: "#22c55e",
  absent: "#ef4444",
  late: "#eab308",
  justified: "#3b82f6"
};

const STATUS_LABELS = {
  present: "Presente",
  absent: "Ausente",
  late: "Atrasado",
  justified: "Justificado"
};

export const AttendanceChart = ({ date, companyId }: AttendanceChartProps) => {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (!companyId) return;

      try {
        console.log('Buscando dados para a data:', formatDate(date));
        
        const { data: attendanceData, error } = await supabase
          .from('daily_attendance')
          .select('status')
          .eq('date', formatDate(date))
          .eq('company_id', companyId);

        if (error) throw error;

        console.log('Dados recebidos:', attendanceData);

        // Contagem de status
        const statusCount = {
          present: 0,
          absent: 0,
          late: 0,
          justified: 0
        };

        attendanceData.forEach(record => {
          if (record.status in statusCount) {
            statusCount[record.status as keyof typeof statusCount]++;
          }
        });

        console.log('Contagem por status:', statusCount);

        // Converter para o formato do gráfico
        const chartData = Object.entries(statusCount)
          .filter(([_, value]) => value > 0)
          .map(([status, value]) => ({
            name: status,
            value
          }));

        console.log('Dados do gráfico:', chartData);
        setData(chartData);
      } catch (error) {
        console.error('Erro ao buscar dados de presença:', error);
      }
    };

    fetchAttendanceData();

    // Configurar canal realtime
    const channel = supabase
      .channel('attendance-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'daily_attendance',
          filter: `date=eq.${formatDate(date)}`
        },
        () => {
          fetchAttendanceData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [date, companyId]);

  if (data.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center text-muted-foreground">
        Nenhum dado disponível
      </div>
    );
  }

  return (
    <div className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[entry.name as keyof typeof COLORS]} 
              />
            ))}
          </Pie>
          <Legend
            formatter={(value) => STATUS_LABELS[value as keyof typeof STATUS_LABELS]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};