import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Student } from "@/types/student";
import { FormField } from "@/types/form";
import { supabase } from "@/integrations/supabase/client";
import { CustomTextField } from "./student/form-fields/CustomTextField";
import { CustomPhoneField } from "./student/form-fields/CustomPhoneField";
import { CustomSelectField } from "./student/form-fields/CustomSelectField";
import { CustomMultipleField } from "./student/form-fields/CustomMultipleField";

interface StudentFormProps {
  initialData?: Partial<Student>;
  onSubmit: (student: Student) => void;
}

export const StudentForm = ({ initialData, onSubmit }: StudentFormProps) => {
  const [formData, setFormData] = useState<Partial<Student>>(() => {
    if (initialData?.custom_fields) {
      return {
        ...initialData,
        custom_fields: { ...initialData.custom_fields }
      };
    }
    return initialData || {};
  });
  
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
          type: field.type as FieldType,
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

  const handleCustomFieldChange = (field: FormField, value: any) => {
    console.log('Updating field:', field.name, 'with value:', value);
    
    setFormData(prev => ({
      ...prev,
      custom_fields: {
        ...(prev.custom_fields || {}),
        [field.id]: {
          fieldId: field.id,
          fieldName: field.name,
          label: field.label,
          value: value,
          type: field.type
        }
      }
    }));
  };

  const renderCustomField = (field: FormField) => {
    const currentValue = formData.custom_fields?.[field.id]?.value || "";

    const commonProps = {
      key: field.id,
      field: field,
      value: currentValue,
      onChange: (newValue: any) => handleCustomFieldChange(field, newValue)
    };

    switch (field.type) {
      case "text":
      case "email":
        return <CustomTextField {...commonProps} />;
      case "tel":
        return <CustomPhoneField {...commonProps} />;
      case "select":
        return <CustomSelectField {...commonProps} />;
      case "multiple":
        return <CustomMultipleField {...commonProps} />;
      default:
        return null;
    }
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
        <div key={`field-wrapper-${field.id}`}>
          {renderCustomField(field)}
        </div>
      ))}

      <Button type="submit" className="w-full">
        {initialData ? "Salvar Alterações" : "Adicionar Aluno"}
      </Button>
    </form>
  );
};