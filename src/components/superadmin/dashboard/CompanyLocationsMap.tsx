import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function CompanyLocationsMap() {
  const { data: locations = [] } = useQuery({
    queryKey: ["company-locations"],
    queryFn: async () => {
      const { data } = await supabase
        .from("emails")
        .select("location, company_id")
        .not("location", "is", null);

      const locationCounts = data?.reduce((acc, curr) => {
        if (curr.location) {
          acc[curr.location] = (acc[curr.location] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(locationCounts || {})
        .map(([location, count]) => ({
          location,
          count,
        }))
        .sort((a, b) => b.count - a.count);
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição Geográfica das Empresas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {locations.map((item) => (
            <div 
              key={item.location} 
              className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
            >
              <span className="font-medium">{item.location}</span>
              <span className="text-sm text-muted-foreground">
                {item.count} {item.count === 1 ? 'empresa' : 'empresas'}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}