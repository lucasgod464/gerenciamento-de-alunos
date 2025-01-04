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
import { RoomSelect } from "./RoomSelect";
import { useCustomFields } from "@/hooks/useCustomFields";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";

interface StudentFormProps {
  initialData?: Student;
  onSubmit: (student: Student) => void;
}

export const StudentForm = ({
  initialData,
  onSubmit
}: StudentFormProps) => {
  const [status, setStatus] = useState<boolean>(
    initialData?.status ?? true
  );
  const [selectedRoom, setSelectedRoom] = useState<string>(
    initialData?.room || ""
  );
  const { user: currentUser } = useAuth();
  const { fields, isLoading } = useCustomFields();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const customFields = fields.reduce((acc: Record<string, any>, field) => {
      if (field.type === "multiple") {
        const selectedOptions = Array.from(formData.getAll(field.name));
        acc[field.name] = selectedOptions.join(",");
      } else {
        acc[field.name] = formData.get(field.name);
      }
      return acc;
    }, {});

    const studentData: Student = {
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      name: formData.get("fullName") as string,
      birthDate: formData.get("birthDate") as string,
      room: selectedRoom,
      status: status,
      email: null,
      document: null,
      address: null,
      customFields,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      companyId: currentUser?.companyId || null,
    };

    onSubmit(studentData);
  };

  if (isLoading) {
    return <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div className="space-y-2">
        <Label htmlFor="room">Sala</Label>
        <RoomSelect 
          value={selectedRoom} 
          onChange={setSelectedRoom}
          required
        />
      </div>

      {fields.map((field) => (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.name}>{field.label}</Label>
          {field.type === "text" && (
            <Input
              id={field.name}
              name={field.name}
              required={field.required}
              defaultValue={initialData?.customFields?.[field.name]}
            />
          )}
          {field.type === "textarea" && (
            <Textarea
              id={field.name}
              name={field.name}
              required={field.required}
              defaultValue={initialData?.customFields?.[field.name]}
            />
          )}
          {field.type === "select" && field.options && (
            <Select
              name={field.name}
              defaultValue={initialData?.customFields?.[field.name]}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {field.type === "multiple" && field.options && (
            <div className="space-y-2">
              {field.options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.name}-${option}`}
                    name={field.name}
                    value={option}
                    defaultChecked={initialData?.customFields?.[field.name]?.includes(option)}
                  />
                  <Label htmlFor={`${field.name}-${option}`}>
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <Button type="submit" className="w-full">
        {initialData ? "Salvar" : "Criar"}
      </Button>
    </form>
  );
};