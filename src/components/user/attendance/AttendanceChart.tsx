import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/utils/dateUtils";

interface AttendanceChartProps {
  date: Date;
  companyId: string;
}

interface ChartData {
  name: string;
  value: number;
  percentage: number;
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

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 border rounded shadow-sm">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm">
          {data.value} alunos ({data.percentage?.toFixed(1)}%)
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = (props: any) => {
  const { payload } = props;
  if (!payload) return null;
  
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry: any, index: number) => {
        if (!entry || !entry.payload) return null;
        
        return (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">
              {entry.value}: {entry.payload.value} ({entry.payload.percentage?.toFixed(1)}%)
            </span>
          </div>
        );
      })}
    </div>
  );
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

        // Calcular total para percentagens
        const total = Object.values(statusCount).reduce((a, b) => a + b, 0);

        // Converter para o formato do gráfico com percentagens
        const chartData = Object.entries(statusCount)
          .filter(([_, value]) => value > 0)
          .map(([status, value]) => ({
            name: STATUS_LABELS[status as keyof typeof STATUS_LABELS],
            value,
            percentage: (value / total) * 100
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
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[entry.name.toLowerCase().replace('presente', 'present')
                  .replace('ausente', 'absent')
                  .replace('atrasado', 'late')
                  .replace('justificado', 'justified') as keyof typeof COLORS]} 
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};