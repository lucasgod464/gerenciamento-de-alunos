import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BasicInfoFieldsProps {
  initialData?: any;
  selectedRoom: string;
  setSelectedRoom: (value: string) => void;
  status: "active" | "inactive";
  setStatus: (value: "active" | "inactive") => void;
  rooms: { id: string; name: string }[];
}

export const BasicInfoFields = ({
  initialData,
  selectedRoom,
  setSelectedRoom,
  status,
  setStatus,
  rooms,
}: BasicInfoFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Nome Completo</Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          required
          defaultValue={initialData?.name}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="birthDate">Data de Nascimento</Label>
        <Input
          id="birthDate"
          name="birthDate"
          type="date"
          required
          defaultValue={initialData?.birthDate}
        />
      </div>

      <div className="space-y-2">
        <Label>Sala</Label>
        <Select value={selectedRoom} onValueChange={setSelectedRoom} required>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma sala" />
          </SelectTrigger>
          <SelectContent>
            {rooms.map((room) => (
              <SelectItem key={room.id} value={room.id}>
                {room.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          value={status}
          onValueChange={(value: "active" | "inactive") => setStatus(value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="inactive">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};