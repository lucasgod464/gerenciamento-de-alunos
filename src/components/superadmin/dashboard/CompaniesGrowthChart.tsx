import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DateRange } from "@/types/attendance";

interface CompaniesGrowthData {
  month: string;
  total: number;
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
        months.map(async ({ start, end, month }) => {
          const { count } = await supabase
            .from("companies")
            .select("*", { count: "exact", head: true })
            .gte("created_at", start)
            .lte("created_at", end);

          return {
            month,
            total: count || 0,
          };
        })
      );

      return companiesData;
    },
    enabled: !!dateRange.from && !!dateRange.to
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Crescimento de Empresas</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          Carregando...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Crescimento de Empresas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
