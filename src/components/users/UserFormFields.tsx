import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { Room } from "@/types/room";
import { MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RoomFormFieldsProps {
  onChange: (field: keyof Room, value: any) => void;
  editingRoom?: Room | null;
}

export function RoomFormFields({ onChange, editingRoom }: RoomFormFieldsProps) {
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
    if (editingRoom) {
      const [start, end] = editingRoom.schedule.split(" - ");
      setStartTime(start);
      setEndTime(end);
      
      onChange("name", editingRoom.name);
      onChange("location", editingRoom.location);
      onChange("category", editingRoom.category);
      onChange("status", editingRoom.status);
    }
  }, [editingRoom, user]);

  const fetchCategories = async () => {
    if (!user?.companyId) return;

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .eq('company_id', user.companyId)
        .eq('status', true);

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Erro ao carregar categorias",
        description: "Não foi possível carregar as categorias.",
        variant: "destructive",
      });
    }
  };

  const handleTimeChange = (type: "start" | "end", value: string) => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(value)) return;

    if (type === "start") {
      setStartTime(value);
      if (endTime) {
        onChange("schedule", `${value} - ${endTime}`);
      }
    } else {
      setEndTime(value);
      if (startTime) {
        onChange("schedule", `${startTime} - ${value}`);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Sala</Label>
        <Input
          id="name"
          defaultValue={editingRoom?.name}
          onChange={(e) => onChange("name", e.target.value)}
          className="transition-all duration-200 hover:border-primary focus:border-primary"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Horário Início</Label>
          <Input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => handleTimeChange("start", e.target.value)}
            className="w-full transition-all duration-200 hover:border-primary focus:border-primary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime">Horário Fim</Label>
          <Input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => handleTimeChange("end", e.target.value)}
            className="w-full transition-all duration-200 hover:border-primary focus:border-primary"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Endereço</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="location"
            defaultValue={editingRoom?.location}
            onChange={(e) => onChange("location", e.target.value)}
            className="pl-9 transition-all duration-200 hover:border-primary focus:border-primary"
            placeholder="Digite o endereço completo da sala..."
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Select 
          defaultValue={editingRoom?.category}
          onValueChange={(value) => onChange("category", value)}
        >
          <SelectTrigger className="transition-all duration-200 hover:border-primary focus:border-primary">
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Label htmlFor="status">Status</Label>
        <Switch
          id="status"
          defaultChecked={editingRoom?.status ?? true}
          onCheckedChange={(checked) => onChange("status", checked)}
        />
        <span className="text-sm text-muted-foreground">
          Ativa
        </span>
      </div>
    </div>
  );
}