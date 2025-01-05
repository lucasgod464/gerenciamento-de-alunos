import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

interface Specialization {
  id: string;
  name: string;
  status: boolean;
}

interface SpecializationSelectionFieldsProps {
  selectedSpecializations: string[];
  onSpecializationToggle: (specializationId: string) => void;
  defaultValues?: any;
}

export function SpecializationSelectionFields({ 
  selectedSpecializations, 
  onSpecializationToggle,
  defaultValues 
}: SpecializationSelectionFieldsProps) {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchSpecializations = async () => {
      if (!currentUser?.companyId) return;

      const { data: specializationsData, error } = await supabase
        .from('specializations')
        .select('*')
        .eq('company_id', currentUser.companyId)
        .eq('status', true)
        .order('name');

      if (error) {
        console.error('Error fetching specializations:', error);
        return;
      }

      setSpecializations(specializationsData);
    };

    fetchSpecializations();
  }, [currentUser?.companyId]);

  const filteredSpecializations = specializations.filter(spec =>
    spec.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <Label>Especializações</Label>
      <Input
        placeholder="Buscar especializações..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-2"
      />
      <ScrollArea className="h-[200px] w-full rounded-md border p-4">
        <div className="space-y-4">
          {filteredSpecializations.map((spec) => (
            <div key={spec.id} className="flex items-center space-x-2">
              <Checkbox
                id={`spec-${spec.id}`}
                checked={selectedSpecializations.includes(spec.id)}
                onCheckedChange={() => onSpecializationToggle(spec.id)}
              />
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <label
                htmlFor={`spec-${spec.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {spec.name}
              </label>
            </div>
          ))}
          {filteredSpecializations.length === 0 && (
            <p className="text-sm text-muted-foreground">
              {searchTerm ? "Nenhuma especialização encontrada" : "Nenhuma especialização disponível"}
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}