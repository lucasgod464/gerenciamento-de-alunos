import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface AttendanceChartProps {
  date: Date;
}

interface AttendanceCount {
  name: string;
  value: number;
}

const COLORS = {
  present: "#22c55e",
  absent: "#ef4444",
  late: "#f59e0b",
  justified: "#6366f1"
};

const CHART_CONFIG = {
  present: { label: "Presente", color: COLORS.present },
  absent: { label: "Ausente", color: COLORS.absent },
  late: { label: "Atrasado", color: COLORS.late },
  justified: { label: "Justificado", color: COLORS.justified }
};

export function AttendanceChart({ date }: AttendanceChartProps) {
  const [data, setData] = useState<AttendanceCount[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (!user?.companyId) return;

      try {
        const { data: attendance, error } = await supabase
          .from('daily_attendance')
          .select('status')
          .eq('date', date.toISOString().split('T')[0])
          .eq('company_id', user.companyId);

        if (error) throw error;

        const counts = {
          present: 0,
          absent: 0,
          late: 0,
          justified: 0
        };

        attendance?.forEach(record => {
          if (record.status in counts) {
            counts[record.status as keyof typeof counts]++;
          }
        });

        const chartData = Object.entries(counts).map(([name, value]) => ({
          name,
          value
        }));

        setData(chartData);
      } catch (error) {
        console.error('Erro ao buscar dados de presença:', error);
      }
    };

    // Busca inicial dos dados
    fetchAttendanceData();

    // Inscreve no canal de realtime para atualizações
    const channel = supabase
      .channel('attendance-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'daily_attendance',
          filter: `date=eq.${date.toISOString().split('T')[0]}`
        },
        () => {
          // Atualiza os dados quando houver mudanças
          fetchAttendanceData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [date, user?.companyId]);

  if (data.length === 0) {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-4">Estatísticas de Presença</h3>
        <p className="text-muted-foreground text-center py-8">
          Nenhum dado de presença registrado para esta data
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Estatísticas de Presença</h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
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
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-4">
          {Object.entries(CHART_CONFIG).map(([key, { label, color }]) => (
            <div key={key} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}