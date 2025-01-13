import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface CompanySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function CompanySelect({ value, onChange }: CompanySelectProps) {
  const { data: companies = [] } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("id, name")
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-2">
      <Label htmlFor="company">Empresa</Label>
      <Select
        value={value}
        onValueChange={onChange}
        name="company"
        required
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione a empresa" />
        </SelectTrigger>
        <SelectContent>
          {companies.length > 0 ? (
            companies.map((company) => (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-companies" disabled>
              Nenhuma empresa cadastrada
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
