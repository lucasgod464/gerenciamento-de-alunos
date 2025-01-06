import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function StorageUsageChart() {
  const { data: chartData = [] } = useQuery({
    queryKey: ["storage-usage"],
    queryFn: async () => {
      const { data } = await supabase
        .from("companies")
        .select("name, storage_used")
        .order("storage_used", { ascending: false })
        .limit(5);

      return data?.map(company => ({
        name: company.name,
        value: Number((company.storage_used / (1024 * 1024 * 1024)).toFixed(2)) // Converter para GB
      })) || [];
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uso de Armazenamento por Empresa (GB)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}GB`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}