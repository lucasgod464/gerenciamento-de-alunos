import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Student } from "@/types/student";
import { FormField } from "@/types/form";
import { RoomSelect } from "./RoomSelect";
import { CustomFields } from "./CustomFields";
import { saveStudentToRoom, removeStudentFromRoom, saveStudentDetails } from "@/utils/storageUtils";
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
  const [status, setStatus] = useState<"active" | "inactive">(
    initialData?.status || "active"
  );
  const [selectedRoom, setSelectedRoom] = useState<string>(
    initialData?.room || ""
  );
  const [customFields, setCustomFields] = useState<FormField[]>([]);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.companyId) return;

    const loadCustomFields = () => {
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
    };

    loadCustomFields();
    window.addEventListener("formFieldsUpdated", loadCustomFields);

    return () => {
      window.removeEventListener("formFieldsUpdated", loadCustomFields);
    };
  }, [currentUser]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Se estiver editando, remover o aluno da sala antiga
    if (initialData && initialData.room !== selectedRoom) {
      removeStudentFromRoom(initialData.id, initialData.room);
    }

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

    // Salvar o aluno apenas na sala selecionada
    if (currentUser?.companyId) {
      saveStudentToRoom(studentData.id, selectedRoom, currentUser.companyId);
      saveStudentDetails(studentData, selectedRoom);
    }

    onSubmit(studentData);
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

      <div className="space-y-2">
        <Label htmlFor="room">Sala</Label>
        <RoomSelect
          value={selectedRoom}
          onChange={setSelectedRoom}
          required
        />
      </div>

      <CustomFields 
        fields={customFields} 
        initialValues={initialData?.customFields}
      />

      <Button type="submit" className="w-full">
        <Save className="mr-2 h-4 w-4" />
        {initialData ? "Salvar Alterações" : "Adicionar Aluno"}
      </Button>
    </form>
  );
};