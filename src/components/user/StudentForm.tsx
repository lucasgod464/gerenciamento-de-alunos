import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Student } from "@/types/student";
import { FormField } from "@/types/form";

interface Room {
  id: string;
  name: string;
  companyId: string | null;
}

interface StudentFormProps {
  onSubmit: (student: Student) => void;
}

export const StudentForm = ({ onSubmit }: StudentFormProps) => {
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.companyId) return;
    
    // Load rooms
    const storedRooms = localStorage.getItem("rooms");
    if (storedRooms) {
      const allRooms = JSON.parse(storedRooms);
      const companyRooms = allRooms.filter(
        (room: Room) => room.companyId === currentUser.companyId
      );
      setRooms(companyRooms);
      if (companyRooms.length > 0) {
        setSelectedRoom(companyRooms[0].id);
      }
    }

    // Load form fields configuration
    const storedFields = localStorage.getItem("formFields");
    if (storedFields) {
      const fields = JSON.parse(storedFields);
      setFormFields(fields);
    }
  }, [currentUser]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newStudent: Student = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get("fullName") as string,
      birthDate: formData.get("birthDate") as string,
      email: formData.get("email") as string,
      document: formData.get("document") as string,
      address: formData.get("address") as string,
      room: selectedRoom,
      status: status,
      createdAt: new Date().toISOString(),
      companyId: currentUser?.companyId || null,
    };

    onSubmit(newStudent);
    e.currentTarget.reset();
    setStatus("active");
  };

  const renderFormField = (field: FormField) => {
    switch (field.type) {
      case "text":
      case "email":
      case "tel":
        return (
          <div className="space-y-2" key={field.id}>
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              name={field.name}
              type={field.type}
              required={field.required}
            />
          </div>
        );
      case "textarea":
        return (
          <div className="space-y-2" key={field.id}>
            <Label htmlFor={field.name}>{field.label}</Label>
            <textarea
              id={field.name}
              name={field.name}
              className="w-full min-h-[100px] p-2 border rounded-md"
              required={field.required}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo Aluno</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formFields.map((field) => renderFormField(field))}
          
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
                checked={status === "active"}
                onCheckedChange={(checked) => setStatus(checked ? "active" : "inactive")}
              />
              <Label htmlFor="status">Ativo</Label>
            </div>
          </div>

          <Button type="submit" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Aluno
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};