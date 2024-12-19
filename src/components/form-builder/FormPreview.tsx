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
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface FormPreviewProps {
  fields: FormField[];
  onSubmit?: (formData: any) => void;
  showSubmitButton?: boolean;
}

export function FormPreview({ fields, onSubmit, showSubmitButton = true }: FormPreviewProps) {
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!onSubmit) return;

    const formData = new FormData(e.currentTarget);
    const values: Record<string, any> = {};
    
    fields.forEach((field) => {
      values[field.name] = formData.get(field.id);
    });

    values.room = selectedRoom;
    values.status = status ? "active" : "inactive";

    onSubmit(values);
  };

  const sortedFields = [...fields].sort((a, b) => a.order - b.order);

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle>Novo Aluno</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
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

          {showSubmitButton && (
            <Button type="submit" className="md:col-span-2">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Aluno
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}