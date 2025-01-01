import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RoomFormFieldsProps {
  defaultValues?: {
    name?: string;
    schedule?: string;
    location?: string;
    category?: string;
    studyRoom?: string;
  };
  onFieldChange: (field: string, value: string) => void;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

export function RoomFormFields({ defaultValues, onFieldChange }: RoomFormFieldsProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, color')
          .eq('company_id', user?.companyId)
          .eq('status', true);

        if (error) throw error;

        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: "Erro ao carregar categorias",
          description: "Não foi possível carregar as categorias. Tente novamente mais tarde.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.companyId) {
      fetchCategories();
    }
  }, [user?.companyId, toast]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Sala</Label>
        <Input
          id="name"
          placeholder="Digite o nome da sala"
          value={defaultValues?.name || ""}
          onChange={(e) => onFieldChange("name", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="schedule">Horário</Label>
        <Input
          id="schedule"
          placeholder="Digite o horário"
          value={defaultValues?.schedule || ""}
          onChange={(e) => onFieldChange("schedule", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Localização</Label>
        <Input
          id="location"
          placeholder="Digite a localização"
          value={defaultValues?.location || ""}
          onChange={(e) => onFieldChange("location", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Select
          value={defaultValues?.category || ""}
          onValueChange={(value) => onFieldChange("category", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <SelectItem value="loading" disabled>
                Carregando categorias...
              </SelectItem>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <SelectItem 
                  key={category.id} 
                  value={category.id}
                  className="flex items-center gap-2"
                >
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color || '#e5e7eb' }} 
                  />
                  {category.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="empty" disabled>
                Nenhuma categoria encontrada
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="studyRoom">Sala de Estudo</Label>
        <Textarea
          id="studyRoom"
          placeholder="Digite informações sobre a sala de estudo"
          value={defaultValues?.studyRoom || ""}
          onChange={(e) => onFieldChange("studyRoom", e.target.value)}
        />
      </div>
    </div>
  );
}