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

const generateTimeOptions = () => {
  const times = [];
  for (let hour = 7; hour <= 22; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      times.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  return times;
};

const timeOptions = generateTimeOptions();

export function RoomFormFields({ room, onChange }: RoomFormFieldsProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.companyId) return;
    
    const allCategories = JSON.parse(localStorage.getItem("categories") || "[]");
    const companyCategories = allCategories.filter(
      (cat: Category) => cat.companyId === user.companyId && cat.status === true
    );
    setCategories(companyCategories);
  }, [user]);

  useEffect(() => {
    if (room.schedule) {
      const [start, end] = room.schedule.split(" - ");
      setStartTime(start);
      setEndTime(end);
    }
  }, [room.schedule]);

  const handleTimeChange = (type: "start" | "end", value: string) => {
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
          value={room.name || ""}
          onChange={(e) => onChange("name", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Horário Início</Label>
          <Select
            value={startTime}
            onValueChange={(value) => handleTimeChange("start", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Horário início" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((time) => (
                <SelectItem key={`start-${time}`} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime">Horário Fim</Label>
          <Select
            value={endTime}
            onValueChange={(value) => handleTimeChange("end", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Horário fim" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((time) => (
                <SelectItem key={`end-${time}`} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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