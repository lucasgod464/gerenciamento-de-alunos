import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface CategoryFieldsProps {
  defaultValues?: {
    specialization?: string;
  };
  specializations: Array<{ id: string; name: string }>;
}

export function CategoryFields({ defaultValues, specializations }: CategoryFieldsProps) {
  const [availableSpecializations, setAvailableSpecializations] = useState<Array<{ id: string; name: string }>>([]);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchSpecializations = async () => {
      if (!currentUser?.companyId) return;

      const { data: specializationsData, error } = await supabase
        .from('specializations')
        .select('id, name')
        .eq('company_id', currentUser.companyId)
        .eq('status', true)
        .order('name');

      if (error) {
        console.error('Error fetching specializations:', error);
        return;
      }

      setAvailableSpecializations(specializationsData);
    };

    fetchSpecializations();
  }, [currentUser?.companyId]);

  return (
    <div className="space-y-2">
      <Label htmlFor="specialization">Especialização</Label>
      <Select name="specialization" defaultValue={defaultValues?.specialization}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione a especialização" />
        </SelectTrigger>
        <SelectContent>
          {availableSpecializations.map((spec) => (
            <SelectItem key={spec.id} value={spec.id}>
              {spec.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}