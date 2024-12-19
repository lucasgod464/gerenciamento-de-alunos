import { FormField } from "@/types/form-builder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DynamicFormField } from "./DynamicFormField";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

interface FormPreviewProps {
  fields: FormField[];
}

export function FormPreview({ fields }: FormPreviewProps) {
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [status, setStatus] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.companyId) return;
    
    const storedRooms = localStorage.getItem("rooms");
    if (storedRooms) {
      const allRooms = JSON.parse(storedRooms);
      const companyRooms = allRooms.filter(
        (room: { companyId: string | null }) => room.companyId === currentUser.companyId
      );
      setRooms(companyRooms);
      if (companyRooms.length > 0) {
        setSelectedRoom(companyRooms[0].id);
      }
    }
  }, [currentUser]);

  const sortedFields = [...fields].sort((a, b) => a.order - b.order);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo Aluno</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2">
          {sortedFields.map((field) => (
            <div key={field.id} className={field.name === "address" ? "md:col-span-2" : ""}>
              <DynamicFormField field={field} />
            </div>
          ))}

          <div className="space-y-2">
            <Label htmlFor="room">Sala</Label>
            <Select value={selectedRoom} onValueChange={setSelectedRoom}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a sala" />
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
            <div className="flex items-center space-x-2">
              <Switch 
                id="status" 
                checked={status}
                onCheckedChange={setStatus}
              />
              <Label htmlFor="status">Ativo</Label>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}