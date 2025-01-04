import { useEffect, useState } from "react";
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
import { FormField } from "@/types/form";
import { supabase } from "@/integrations/supabase/client";

interface StudentFormProps {
  initialData?: Partial<Student>;
  onSubmit: (student: Student) => void;
}

const defaultFields: FormField[] = [
  {
    id: "nome_completo",
    name: "nome_completo",
    label: "Nome Completo",
    type: "text",
    required: true,
    order: 0,
    isDefault: true,
  },
  {
    id: "data_nascimento",
    name: "data_nascimento",
    label: "Data de Nascimento",
    type: "date",
    required: true,
    order: 1,
    isDefault: true,
  },
  {
    id: "sala",
    name: "sala",
    label: "Sala",
    type: "select",
    required: true,
    order: 2,
    isDefault: true,
  },
  {
    id: "status",
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    order: 3,
    isDefault: true,
    options: ["Ativo", "Inativo"]
  }
];

export const StudentForm = ({ initialData, onSubmit }: StudentFormProps) => {
  const [formData, setFormData] = useState<Partial<Student>>(initialData || {});
  const [customFields, setCustomFields] = useState<FormField[]>([]);
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const loadCustomFields = async () => {
      const { data: fields } = await supabase
        .from('admin_form_fields')
        .select('*')
        .order('order');
      
      if (fields) {
        const mappedFields = fields.map(field => ({
          id: field.id,
          name: field.name,
          label: field.label,
          type: field.type as FormField['type'],
          description: field.description || undefined,
          required: field.required || false,
          order: field.order,
          options: field.options as string[] | undefined,
        }));
        setCustomFields(mappedFields);
      }
    };

    const loadRooms = async () => {
      const { data: roomsData } = await supabase
        .from('rooms')
        .select('id, name')
        .eq('status', true);
      
      if (roomsData) {
        setRooms(roomsData);
      }
    };

    loadCustomFields();
    loadRooms();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit && formData.name && formData.birth_date) {
      onSubmit(formData as Student);
    }
  };

  const handleCustomFieldChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      custom_fields: {
        ...(prev.custom_fields || {}),
        [name]: value
      }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo</Label>
        <Input
          id="name"
          value={formData.name || ""}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="birth_date">Data de Nascimento</Label>
        <Input
          id="birth_date"
          type="date"
          value={formData.birth_date || ""}
          onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Sala</Label>
        <Select
          value={formData.room || ""}
          onValueChange={(value) => setFormData({ ...formData, room: value })}
          required
        >
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
          value={formData.status ? "true" : "false"}
          onValueChange={(value) => setFormData({ ...formData, status: value === "true" })}
          required
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Ativo</SelectItem>
            <SelectItem value="false">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {customFields.map((field) => (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.name}>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {field.type === "text" && (
            <Input
              id={field.name}
              value={formData.custom_fields?.[field.name] || ""}
              onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
              required={field.required}
            />
          )}
          {field.type === "select" && field.options && (
            <Select
              value={formData.custom_fields?.[field.name] || ""}
              onValueChange={(value) => handleCustomFieldChange(field.name, value)}
              required={field.required}
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
        </div>
      ))}

      <Button type="submit" className="w-full">
        {initialData ? "Salvar Alterações" : "Adicionar Aluno"}
      </Button>
    </form>
  );
};