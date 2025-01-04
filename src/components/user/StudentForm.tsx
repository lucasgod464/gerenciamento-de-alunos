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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface StudentFormProps {
  initialData?: Partial<Student>;
  onSubmit: (student: Student) => void;
}

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
          
          {field.type === "email" && (
            <Input
              id={field.name}
              type="email"
              value={formData.custom_fields?.[field.name] || ""}
              onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
              required={field.required}
            />
          )}

          {field.type === "tel" && (
            <Input
              id={field.name}
              type="tel"
              value={formData.custom_fields?.[field.name] || ""}
              onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
              required={field.required}
            />
          )}
          
          {field.type === "textarea" && (
            <Textarea
              id={field.name}
              value={formData.custom_fields?.[field.name] || ""}
              onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
              required={field.required}
            />
          )}
          
          {field.type === "date" && (
            <Input
              id={field.name}
              type="date"
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
          
          {field.type === "multiple" && field.options && (
            <div className="space-y-2">
              {field.options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.name}-${option}`}
                    checked={Array.isArray(formData.custom_fields?.[field.name]) && 
                      formData.custom_fields?.[field.name]?.includes(option)}
                    onCheckedChange={(checked) => {
                      const currentValues = Array.isArray(formData.custom_fields?.[field.name]) 
                        ? formData.custom_fields?.[field.name] 
                        : [];
                      const newValues = checked
                        ? [...currentValues, option]
                        : currentValues.filter((value: string) => value !== option);
                      handleCustomFieldChange(field.name, newValues);
                    }}
                  />
                  <label
                    htmlFor={`${field.name}-${option}`}
                    className="text-sm font-medium leading-none"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <Button type="submit" className="w-full">
        {initialData ? "Salvar Alterações" : "Adicionar Aluno"}
      </Button>
    </form>
  );
};