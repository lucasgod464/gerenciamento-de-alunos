import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function RecentCompanies() {
  const { data: companies = [] } = useQuery({
    queryKey: ["recent-companies"],
    queryFn: async () => {
      const { data } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      return data || [];
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Empresas Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {companies.map((company) => (
            <div
              key={company.id}
              className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
            >
              <div>
                <p className="font-medium">{company.name}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(company.created_at), "PPP", { locale: ptBR })}
                </p>
              </div>
              <Badge variant={company.status === "Ativa" ? "success" : "destructive"}>
                {company.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
