import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Student } from "@/types/student";
import { FormField } from "@/types/form";
import { supabase } from "@/integrations/supabase/client";
import { CustomTextField } from "./student/form-fields/CustomTextField";
import { CustomPhoneField } from "./student/form-fields/CustomPhoneField";
import { CustomSelectField } from "./student/form-fields/CustomSelectField";
import { CustomMultipleField } from "./student/form-fields/CustomMultipleField";
import { useToast } from "@/hooks/use-toast";
import { BasicInfoFields } from "./student/form/BasicInfoFields";

interface StudentFormProps {
  initialData?: Partial<Student>;
  onSubmit: (student: Student) => void;
}

export const StudentForm = ({ initialData, onSubmit }: StudentFormProps) => {
  const [formData, setFormData] = useState<Partial<Student>>(() => {
    if (initialData?.customFields) {
      return {
        ...initialData,
        customFields: { ...initialData.customFields }
      };
    }
    return initialData || {};
  });
  
  const [customFields, setCustomFields] = useState<FormField[]>([]);
  const [enrollmentFields, setEnrollmentFields] = useState<FormField[]>([]);
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadAllFields = async () => {
      try {
        // Carregar campos administrativos
        const { data: adminFields } = await supabase
          .from('admin_form_fields')
          .select('*')
          .order('order');
        
        // Carregar campos do formulário público
        const { data: publicFields } = await supabase
          .from('enrollment_form_fields')
          .select('*')
          .order('order');
        
        if (adminFields) {
          const mappedAdminFields = adminFields.map(field => ({
            id: field.id,
            name: field.name,
            label: field.label,
            type: field.type as FormField['type'],
            description: field.description || undefined,
            required: field.required || false,
            order: field.order,
            options: field.options as string[] | undefined,
          }));
          setCustomFields(mappedAdminFields);
        }

        if (publicFields) {
          const mappedPublicFields = publicFields.map(field => ({
            id: field.id,
            name: field.name,
            label: field.label,
            type: field.type as FormField['type'],
            description: field.description || undefined,
            required: field.required || false,
            order: field.order,
            options: field.options as string[] | undefined,
          }));
          setEnrollmentFields(mappedPublicFields);
        }
      } catch (error) {
        console.error('Erro ao carregar campos:', error);
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

    loadAllFields();
    loadRooms();
  }, []);

  const handleCustomFieldChange = (field: FormField, value: any) => {
    setFormData(prev => ({
      ...prev,
      customFields: {
        ...(prev.customFields || {}),
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.birthDate) {
      toast({
        title: "Erro",
        description: "Nome e data de nascimento são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      await onSubmit(formData as Student);
      setFormData({});
      toast({
        title: "Sucesso",
        description: "Aluno salvo com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao salvar aluno:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações do aluno.",
        variant: "destructive",
      });
    }
  };

  const renderCustomField = (field: FormField) => {
    const currentValue = formData.customFields?.[field.id]?.value || "";

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
      <BasicInfoFields 
        formData={formData}
        setFormData={setFormData}
        rooms={rooms}
      />

      {/* Campos administrativos */}
      {customFields.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Campos Administrativos</h3>
          {customFields.map((field) => (
            <div key={`field-wrapper-${field.id}`}>
              {renderCustomField(field)}
            </div>
          ))}
        </div>
      )}

      {/* Campos do formulário público */}
      {enrollmentFields.length > 0 && Object.keys(formData.customFields || {}).some(key => 
        enrollmentFields.find(field => field.id === key)
      ) && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Campos do Formulário Público</h3>
          {enrollmentFields.map((field) => (
            <div key={`field-wrapper-${field.id}`}>
              {renderCustomField(field)}
            </div>
          ))}
        </div>
      )}

      <Button type="submit" className="w-full">
        {initialData ? "Salvar Alterações" : "Adicionar Aluno"}
      </Button>
    </form>
  );
};