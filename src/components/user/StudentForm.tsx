import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Student } from "@/types/student";
import { useAuth } from "@/hooks/useAuth";

interface StudentFormProps {
  initialData?: Student;
  customFields?: { name: string; label: string }[];
  availableRooms?: { id: string; name: string }[];
  isTransferMode?: boolean;
  onTransfer?: (studentId: string, newRoomId: string) => void;
  onSubmit: (student: Student) => void;
}

export const StudentForm = ({
  initialData,
  customFields = [],
  isTransferMode = false,
  availableRooms = [],
  onTransfer,
  onSubmit
}: StudentFormProps) => {
  const [status, setStatus] = useState<boolean>(
    initialData?.status ?? true
  );
  const [selectedRoom, setSelectedRoom] = useState<string>(
    initialData?.room || ""
  );
  const { user: currentUser } = useAuth();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isTransferMode && onTransfer) {
      onTransfer(initialData?.id || "", selectedRoom);
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isTransferMode && (
        <>
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome Completo</Label>
            <Input
              id="fullName"
              name="fullName"
              defaultValue={initialData?.name}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">Data de Nascimento</Label>
            <Input
              id="birthDate"
              name="birthDate"
              type="date"
              defaultValue={initialData?.birthDate || ""}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status ? "true" : "false"}
              onValueChange={(value) => setStatus(value === "true")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Ativo</SelectItem>
                <SelectItem value="false">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {customFields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                id={field.name}
                name={field.name}
                defaultValue={initialData?.customFields?.[field.name]}
              />
            </div>
          ))}
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="room">Sala</Label>
        <Select value={selectedRoom} onValueChange={setSelectedRoom}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a sala" />
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

      <Button type="submit" className="w-full">
        {isTransferMode ? "Transferir Aluno" : initialData ? "Salvar" : "Criar"}
      </Button>
    </form>
  );
};