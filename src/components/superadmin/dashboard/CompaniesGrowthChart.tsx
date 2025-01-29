import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DateRange } from "@/types/attendance";
import { TrendingUp } from "lucide-react";

interface CompaniesGrowthData {
  month: string;
  total: number;
  percentage?: number;
}

interface CompaniesGrowthChartProps {
  dateRange: DateRange;
}

export const CompaniesGrowthChart = ({ dateRange }: CompaniesGrowthChartProps) => {
  const { data: chartData = [], isLoading } = useQuery({
    queryKey: ["companies-growth", dateRange],
    queryFn: async () => {
      const months = Array.from({ length: 6 }, (_, i) => {
        const date = subMonths(dateRange.to, i);
        return {
          start: startOfMonth(date).toISOString(),
          end: endOfMonth(date).toISOString(),
          month: format(date, "MMM", { locale: ptBR }),
        };
      }).reverse();

      const companiesData = await Promise.all(
        months.map(async ({ start, end, month }, index, array) => {
          const { count } = await supabase
            .from("companies")
            .select("*", { count: "exact", head: true })
            .gte("created_at", start)
            .lte("created_at", end);

          const currentTotal = count || 0;
          let percentage = 0;

          // Calcular a variação percentual em relação ao mês anterior
          if (index > 0) {
            const previousTotal = array[index - 1].total || 0;
            percentage = previousTotal !== 0 
              ? ((currentTotal - previousTotal) / previousTotal) * 100 
              : 0;
          }

          return {
            month,
            total: currentTotal,
            percentage: Number(percentage.toFixed(1))
          };
        })
      );

      return companiesData;
    },
    enabled: !!dateRange.from && !!dateRange.to
  });

  if (isLoading) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
            Crescimento de Empresas
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          Carregando...
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            Total: {payload[0].value}
          </p>
          {payload[0].payload.percentage !== undefined && (
            <p className={`text-sm ${payload[0].payload.percentage > 0 ? 'text-green-600' : payload[0].payload.percentage < 0 ? 'text-red-600' : 'text-gray-600'}`}>
              Variação: {payload[0].payload.percentage > 0 ? '+' : ''}{payload[0].payload.percentage}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
          Crescimento de Empresas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                className="text-xs" 
              />
              <YAxis 
                className="text-xs"
                tickFormatter={(value) => value.toString()}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4, fill: "#8884d8" }}
                activeDot={{ r: 6, fill: "#8884d8" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};