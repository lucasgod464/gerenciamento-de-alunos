import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface CategoryFieldsProps {
  defaultValues?: {
    specialization?: string;
  };
}

export function CategoryFields({ defaultValues }: CategoryFieldsProps) {
  const [availableSpecializations, setAvailableSpecializations] = useState<Array<{ id: string; name: string }>>([]);
  const { user: currentUser } = useAuth();
  const [selectedSpecialization, setSelectedSpecialization] = useState(defaultValues?.specialization || "");

  useEffect(() => {
    const fetchSpecializations = async () => {
      if (!currentUser?.companyId) return;

      try {
        const { data, error } = await supabase
          .from('specializations')
          .select('id, name')
          .eq('company_id', currentUser.companyId)
          .eq('status', true);

        if (error) throw error;
        setAvailableSpecializations(data || []);
      } catch (error) {
        console.error('Error fetching specializations:', error);
      }
    };

    fetchSpecializations();
  }, [currentUser]);

  return (
    <div className="space-y-2">
      <Label htmlFor="specialization">Especialização</Label>
      <Select 
        name="specialization" 
        value={selectedSpecialization}
        onValueChange={setSelectedSpecialization}
      >
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