import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Save } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Student } from "@/types/student";
import { FormField } from "@/types/form";
import { CustomFields } from "./form/CustomFields";
import { RoomSelect } from "./form/RoomSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StudentFormProps {
  onSubmit: (student: Student) => void;
  initialData?: Student;
}

export const StudentForm = ({ onSubmit, initialData }: StudentFormProps) => {
  const [status, setStatus] = useState<"active" | "inactive">(initialData?.status || "active");
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>(initialData?.room || "");
  const [customFields, setCustomFields] = useState<FormField[]>([]);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.companyId) return;
    
    // Carregar salas
    const storedRooms = localStorage.getItem("rooms");
    if (storedRooms) {
      const allRooms = JSON.parse(storedRooms);
      const companyRooms = allRooms.filter(
        (room: any) => room.companyId === currentUser.companyId
      );
      setRooms(companyRooms);
      if (!initialData && companyRooms.length > 0) {
        setSelectedRoom(companyRooms[0].id);
      }
    }

    // Carregar campos personalizados
    const savedFields = localStorage.getItem("formFields");
    if (savedFields) {
      try {
        const parsedFields = JSON.parse(savedFields);
        const defaultFields = ["name", "birthDate", "status", "room"];
        const customFields = parsedFields.filter(
          (field: FormField) => !defaultFields.includes(field.id)
        );
        setCustomFields(customFields);
      } catch (error) {
        console.error("Error parsing custom fields:", error);
      }
    }
  }, [currentUser, initialData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const studentData: Student = {
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      name: formData.get("fullName") as string,
      birthDate: formData.get("birthDate") as string,
      room: selectedRoom,
      status: status,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      companyId: currentUser?.companyId || null,
      customFields: customFields.reduce((acc: Record<string, string>, field) => {
        acc[field.name] = formData.get(field.name) as string;
        return acc;
      }, {}),
    };

    onSubmit(studentData);
    if (!initialData) {
      e.currentTarget.reset();
      setStatus("active");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div className="space-y-2">
        <Label>Sala</Label>
        <RoomSelect
          rooms={rooms}
          selectedRoom={selectedRoom}
          onRoomChange={setSelectedRoom}
        />
      </div>

      <CustomFields
        fields={customFields}
        initialData={initialData?.customFields}
      />

      <Button type="submit" className="w-full">
        {initialData ? (
          <>
            <Save className="mr-2 h-4 w-4" />
            Salvar Alterações
          </>
        ) : (
          <>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Aluno
          </>
        )}
      </Button>
    </form>
  );
};