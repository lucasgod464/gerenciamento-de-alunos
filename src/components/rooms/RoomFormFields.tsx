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

interface Room {
  id?: string;
  name: string;
  schedule: string;
  location: string;
  category: string;
  capacity: number;
  resources: string;
  status: boolean;
  companyId?: string | null;
}

interface Category {
  id: string;
  name: string;
  status: boolean;
  companyId: string | null;
}

interface RoomFormFieldsProps {
  room: Partial<Room>;
  onChange: (field: keyof Room, value: any) => void;
}

export function RoomFormFields({ room, onChange }: RoomFormFieldsProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.companyId) return;
    
    const allCategories = JSON.parse(localStorage.getItem("categories") || "[]");
    const companyCategories = allCategories.filter(
      (cat: Category) => cat.companyId === user.companyId && cat.status === true
    );
    setCategories(companyCategories);
  }, [user]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Sala</Label>
        <Input
          id="name"
          value={room.name || ""}
          onChange={(e) => onChange("name", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="schedule">Horário</Label>
        <Input
          id="schedule"
          value={room.schedule || ""}
          onChange={(e) => onChange("schedule", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Local</Label>
        <Input
          id="location"
          value={room.location || ""}
          onChange={(e) => onChange("location", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Select
          value={room.category || ""}
          onValueChange={(value) => onChange("category", value)}
        >
          <SelectTrigger>
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
      <div className="space-y-2">
        <Label htmlFor="capacity">Capacidade</Label>
        <Input
          id="capacity"
          type="number"
          value={room.capacity || 0}
          onChange={(e) => onChange("capacity", parseInt(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="resources">Recursos</Label>
        <Input
          id="resources"
          value={room.resources || ""}
          onChange={(e) => onChange("resources", e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Label htmlFor="status">Status</Label>
        <Switch
          id="status"
          checked={room.status}
          onCheckedChange={(checked) => onChange("status", checked)}
        />
        <span className="text-sm text-muted-foreground">
          {room.status ? "Ativa" : "Inativa"}
        </span>
      </div>
    </div>
  );
}