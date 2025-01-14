import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Student } from "@/types/student";
import { FormField } from "@/types/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BasicInfoFields } from "./student/form/BasicInfoFields";
import { CustomFieldsSection } from "./student/form/CustomFieldsSection";
import { useAuth } from "@/hooks/useAuth";

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
  const { user } = useAuth();

  useEffect(() => {
    const loadAllFields = async () => {
      if (!user?.companyId) return;

      try {
        const [{ data: adminFields }, { data: publicFields }, { data: roomsData }] = await Promise.all([
          supabase
            .from('admin_form_fields')
            .select('*')
            .eq('company_id', user.companyId)
            .eq('form_type', 'admin')
            .order('order'),
          supabase
            .from('enrollment_form_fields')
            .select('*')
            .eq('company_id', user.companyId)
            .eq('form_type', 'enrollment')
            .order('order'),
          supabase
            .from('rooms')
            .select('id, name')
            .eq('company_id', user.companyId)
            .eq('status', true)
        ]);
        
        if (adminFields) {
          setCustomFields(adminFields.map(field => ({
            id: field.id,
            name: field.name,
            label: field.label,
            type: field.type as FormField['type'],
            description: field.description || undefined,
            required: field.required || false,
            order: field.order,
            options: field.options as string[] | undefined,
            source: 'admin' as const
          })));
        }

        if (publicFields) {
          setEnrollmentFields(publicFields.map(field => ({
            id: field.id,
            name: field.name,
            label: field.label,
            type: field.type as FormField['type'],
            description: field.description || undefined,
            required: field.required || false,
            order: field.order,
            options: field.options as string[] | undefined,
            source: 'public' as const
          })));
        }

        if (roomsData) {
          setRooms(roomsData);
        }
      } catch (error) {
        console.error('Erro ao carregar campos:', error);
      }
    };

    loadAllFields();
  }, [user?.companyId]);

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

  // Verifica se o aluno tem campos do formulário público
  const hasPublicFields = Object.keys(formData.customFields || {}).some(key => 
    enrollmentFields.find(field => field.id === key)
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-4">
      <BasicInfoFields 
        formData={formData}
        setFormData={setFormData}
        rooms={rooms}
      />

      {/* Mostra campos administrativos apenas se houver campos configurados */}
      {customFields.length > 0 && !hasPublicFields && (
        <CustomFieldsSection
          title="Campos Administrativos"
          fields={customFields}
          currentValues={formData.customFields || {}}
          onFieldChange={handleCustomFieldChange}
          show={true}
        />
      )}

      {/* Mostra campos do formulário público apenas se houver campos configurados */}
      {enrollmentFields.length > 0 && hasPublicFields && (
        <CustomFieldsSection
          title="Campos do Formulário Online"
          fields={enrollmentFields}
          currentValues={formData.customFields || {}}
          onFieldChange={handleCustomFieldChange}
          show={true}
        />
      )}

      <div className="sticky bottom-0 bg-white py-4 border-t mt-4">
        <Button type="submit" className="w-full">
          {initialData ? "Salvar Alterações" : "Adicionar Aluno"}
        </Button>
      </div>
    </form>
  );
};
