import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users2, DoorOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

export function DashboardStats() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });

  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats", date],
    queryFn: async () => {
      const startDate = date?.from ? format(date.from, 'yyyy-MM-dd') : undefined;
      const endDate = date?.to ? format(date.to, 'yyyy-MM-dd') : undefined;

      const [
        { count: companiesCount },
        { count: usersCount },
        { count: roomsCount },
      ] = await Promise.all([
        supabase
          .from("companies")
          .select("*", { count: "exact", head: true })
          .gte('created_at', startDate || '1970-01-01')
          .lte('created_at', endDate || '2100-12-31'),
        supabase
          .from("emails")
          .select("*", { count: "exact", head: true })
          .gte('created_at', startDate || '1970-01-01')
          .lte('created_at', endDate || '2100-12-31'),
        supabase
          .from("rooms")
          .select("*", { count: "exact", head: true })
          .gte('created_at', startDate || '1970-01-01')
          .lte('created_at', endDate || '2100-12-31'),
      ]);

      return {
        companies: companiesCount || 0,
        users: usersCount || 0,
        rooms: roomsCount || 0,
      };
    },
  });

  const items = [
    {
      title: "Total de Empresas",
      value: stats?.companies || 0,
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total de Usuários",
      value: stats?.users || 0,
      icon: Users2,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total de Salas",
      value: stats?.rooms || 0,
      icon: DoorOpen,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                    {format(date.to, "dd/MM/yyyy", { locale: ptBR })}
                  </>
                ) : (
                  format(date.from, "dd/MM/yyyy", { locale: ptBR })
                )
              ) : (
                <span>Selecione um período</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.title}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${item.bgColor}`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {item.title}
                  </p>
                  <h2 className="text-2xl font-bold">{item.value}</h2>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}