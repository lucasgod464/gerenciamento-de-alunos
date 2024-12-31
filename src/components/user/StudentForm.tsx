import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Student } from "@/types/student";
import { FormField } from "@/types/form";
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
  const [status, setStatus] = useState<"active" | "inactive">(
    initialData?.status || "active"
  );
  const [selectedRoom, setSelectedRoom] = useState<string>(
    initialData?.room || ""
  );
  const [customFields, setCustomFields] = useState<FormField[]>([]);
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const { user: currentUser } = useAuth();

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

    // Carregar campos personalizados do localStorage
    const loadCustomFields = () => {
      const savedFields = localStorage.getItem("enrollmentFields");
      if (savedFields) {
        try {
          const parsedFields = JSON.parse(savedFields);
          // Filtrar campos padrão
          const defaultFields = ["default-name", "default-birthdate"];
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
      createdAt: initialData?.createdAt || new Date().toISOString(),
      companyId: currentUser?.companyId || null,
      customFields: customFields.reduce((acc: Record<string, string>, field) => {
        acc[field.name] = formData.get(field.name) as string;
        return acc;
      }, {}),
    };

    onSubmit(studentData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isTransferMode ? (
        <>
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

          {customFields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              {field.type === "textarea" ? (
                <Textarea
                  id={field.name}
                  name={field.name}
                  required={field.required}
                  defaultValue={initialData?.customFields?.[field.name]}
                />
              ) : field.type === "select" || field.type === "multiple" ? (
                <Select
                  value={initialData?.customFields?.[field.name] || ""}
                  onValueChange={(value) => {
                    const formElement = e.currentTarget as HTMLFormElement;
                    const input = formElement.elements.namedItem(field.name) as HTMLInputElement;
                    if (input) {
                      input.value = value;
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Selecione ${field.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  defaultValue={initialData?.customFields?.[field.name]}
                />
              )}
            </div>
          ))}
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

      <Button type="submit" className="w-full">
        <Save className="mr-2 h-4 w-4" />
        {isTransferMode ? "Transferir Aluno" : initialData ? "Salvar Alterações" : "Adicionar Aluno"}
      </Button>
    </form>
  );
};