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

interface Room {
  id?: string;
  name: string;
  schedule: string;
  location: string;
  studyRoom: string;
  capacity: number;
  resources: string;
  status: boolean;
  companyId?: string | null;
}

interface RoomFormFieldsProps {
  room: Partial<Room>;
  onChange: (field: keyof Room, value: any) => void;
}

export function RoomFormFields({ room, onChange }: RoomFormFieldsProps) {
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
        <Label htmlFor="studyRoom">Sala de Estudo</Label>
        <Select
          value={room.studyRoom || ""}
          onValueChange={(value) => onChange("studyRoom", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma sala de estudo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="study1">Estudo 1</SelectItem>
            <SelectItem value="study2">Estudo 2</SelectItem>
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