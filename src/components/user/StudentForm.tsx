import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Student } from "@/types/student";
import { FormField } from "@/types/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BasicInfoFields } from "./form-sections/BasicInfoFields";
import { CustomFields } from "./form-sections/CustomFields";
import { Label } from "@/components/ui/label";
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
  isTransferMode?: boolean;
  availableRooms?: { id: string; name: string }[];
  onTransfer?: (studentId: string, newRoomId: string) => void;
}

export const StudentForm = ({ 
  onSubmit, 
  initialData,
  isTransferMode = false,
  availableRooms = [],
  onTransfer
}: StudentFormProps) => {

const [status, setStatus] = useState<boolean>(
  initialData?.status ?? true
);

  const [selectedRoom, setSelectedRoom] = useState<string>(
    initialData?.room || ""
  );
  const [customFields, setCustomFields] = useState<FormField[]>([]);
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const { user: currentUser } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!currentUser?.companyId) return;

    // Carregar salas autorizadas
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const currentUserData = users.find((u: any) => 
      u.id === currentUser.id || u.email === currentUser.email
    );
    
    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    const authorizedRooms = allRooms.filter((room: any) => 
      room.companyId === currentUser.companyId && 
      currentUserData?.authorizedRooms?.includes(room.id)
    );
    
    setRooms(authorizedRooms);

    // Carregar campos personalizados do FormBuilder
    const loadCustomFields = () => {
      const savedFields = localStorage.getItem("formFields");
      if (savedFields) {
        try {
          const parsedFields = JSON.parse(savedFields);
          // Filtrar campos do sistema
          const systemFields = ["nome_completo", "data_nascimento", "sala", "status"];
          const customFields = parsedFields.filter(
            (field: FormField) => !systemFields.includes(field.name)
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
    
    if (isTransferMode && onTransfer && initialData) {
      onTransfer(initialData.id, selectedRoom);
      return;
    }

    const formData = new FormData(e.currentTarget);

const studentData: Student = {
  id: initialData?.id || Math.random().toString(36).substr(2, 9),
  name: formData.get("fullName") as string,
  birthDate: formData.get("birthDate") as string,
  room: selectedRoom,
  status: status,
  email: null,
  document: null,
  address: null,
  customFields: customFields.reduce((acc: Record<string, string>, field) => {
    acc[field.name] = formData.get(field.name) as string;
    return acc;
  }, {}),
  createdAt: initialData?.createdAt || new Date().toISOString(),
  companyId: currentUser?.companyId || null,
};

    onSubmit(studentData);
  };

  return (
    <form onSubmit={handleSubmit} ref={formRef} className="space-y-4">
      <ScrollArea className="h-[60vh] pr-4">
        <div className="space-y-6">
          {!isTransferMode ? (
            <>
              <BasicInfoFields
                initialData={initialData}
                selectedRoom={selectedRoom}
                setSelectedRoom={setSelectedRoom}
                status={status}
                setStatus={setStatus}
                rooms={rooms}
              />
              
              <CustomFields
                fields={customFields}
                initialData={initialData}
                formRef={formRef}
              />
            </>
          ) : (
            <div className="space-y-2">
              <Label>Transferir para Sala</Label>
              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a sala para transferência" />
                </SelectTrigger>
                <SelectContent>
                  {availableRooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="pt-4 border-t">
        <Button type="submit" className="w-full">
          <Save className="mr-2 h-4 w-4" />
          {isTransferMode ? "Transferir Aluno" : initialData ? "Salvar Alterações" : "Adicionar Aluno"}
        </Button>
      </div>
    </form>
  );
};
