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
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Student } from "@/types/student";
import { FormField } from "@/types/form";

interface StudentFormProps {
  onSubmit: (student: Student) => void;
}

export const StudentForm = ({ onSubmit }: StudentFormProps) => {
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.companyId) return;
    
    // Carrega as salas
    const storedRooms = localStorage.getItem("rooms");
    if (storedRooms) {
      const allRooms = JSON.parse(storedRooms);
      const companyRooms = allRooms.filter(
        (room: any) => room.companyId === currentUser.companyId
      );
      setRooms(companyRooms);
      if (companyRooms.length > 0) {
        setSelectedRoom(companyRooms[0].id);
      }
    }

    // Carrega os campos do formulário configurados pelo administrador
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
      email: formData.get("email") as string || "",
      document: formData.get("document") as string || "",
      address: formData.get("address") as string || "",
      room: selectedRoom,
      status: status,
      createdAt: new Date().toISOString(),
      companyId: currentUser?.companyId || null,
    };

    // Adiciona campos customizados configurados pelo administrador
    formFields.forEach((field) => {
      const value = formData.get(field.name);
      if (value) {
        (newStudent as any)[field.name] = value;
      }
    });

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
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome Completo</Label>
            <Input id="fullName" name="fullName" type="text" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">Data de Nascimento</Label>
            <Input id="birthDate" name="birthDate" type="date" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="document">Documento</Label>
            <Input id="document" name="document" type="text" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input id="address" name="address" type="text" required />
          </div>

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
            <Select value={status} onValueChange={(value: "active" | "inactive") => setStatus(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Campos customizados configurados pelo administrador */}
          {formFields.map((field) => renderFormField(field))}

          <Button type="submit" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Aluno
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};