import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Student } from "@/types/student";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FormField } from "@/types/form";

interface StudentInfoDialogProps {
  student: Student | null;
  onClose: () => void;
}

export function StudentInfoDialog({ student, onClose }: StudentInfoDialogProps) {
  const [enrollmentFields, setEnrollmentFields] = useState<FormField[]>([]);

  useEffect(() => {
    const loadEnrollmentFields = async () => {
      if (!student?.companyId) return;
      
      const { data: fields } = await supabase
        .from('enrollment_form_fields')
        .select('*')
        .eq('company_id', student.companyId)
        .order('order');

      if (fields) {
        setEnrollmentFields(fields.map(field => ({
          id: field.id,
          name: field.name,
          label: field.label,
          type: field.type as any,
          description: field.description || '',
          required: field.required || false,
          order: field.order,
          options: Array.isArray(field.options) ? field.options.map(opt => String(opt)) : []
        })));
      }
    };

    loadEnrollmentFields();
  }, [student?.companyId]);

  if (!student) return null;

  // Função para formatar o valor do campo personalizado
  const formatCustomFieldValue = (value: any): string => {
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    if (value === null || value === undefined) {
      return "Não informado";
    }
    if (typeof value === "boolean") {
      return value ? "Sim" : "Não";
    }
    return String(value);
  };

  // Função para obter o label do campo personalizado
  const getFieldLabel = (fieldId: string): string => {
    if (!student.customFields || typeof student.customFields !== 'object') {
      return fieldId;
    }

    const customField = student.customFields[fieldId];
    if (customField && typeof customField === 'object' && 'label' in customField) {
      return customField.label as string;
    }

    const field = enrollmentFields.find(f => f.id === fieldId);
    return field?.label || fieldId;
  };

  // Função para obter o valor do campo personalizado
  const getFieldValue = (fieldId: string): string => {
    if (!student.customFields || typeof student.customFields !== 'object') {
      return "Não informado";
    }

    const customField = student.customFields[fieldId];
    if (customField && typeof customField === 'object' && 'value' in customField) {
      return formatCustomFieldValue(customField.value);
    }

    return "Não informado";
  };

  // Filtrar campos personalizados que já são mostrados nos campos básicos
  const basicFields = ['nome_completo', 'data_nascimento'];
  const customFieldEntries = student.customFields && typeof student.customFields === 'object' 
    ? Object.entries(student.customFields)
    : [];

  const filteredCustomFields = customFieldEntries.filter(([key]) => {
    const normalizedKey = key.toLowerCase().replace(/_/g, '');
    return !basicFields.includes(normalizedKey);
  });

  return (
    <Dialog open={!!student} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Informações do Aluno</DialogTitle>
          <DialogDescription>
            Dados fornecidos durante a inscrição
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Campos básicos */}
          <div className="flex flex-col space-y-1.5">
            <label className="font-semibold">Nome</label>
            <p className="text-sm text-muted-foreground">{student.name}</p>
          </div>
          <div className="flex flex-col space-y-1.5">
            <label className="font-semibold">Data de Nascimento</label>
            <p className="text-sm text-muted-foreground">{student.birthDate}</p>
          </div>
          {student.email && (
            <div className="flex flex-col space-y-1.5">
              <label className="font-semibold">Email</label>
              <p className="text-sm text-muted-foreground">{student.email}</p>
            </div>
          )}
          {student.document && (
            <div className="flex flex-col space-y-1.5">
              <label className="font-semibold">Documento</label>
              <p className="text-sm text-muted-foreground">{student.document}</p>
            </div>
          )}
          {student.address && (
            <div className="flex flex-col space-y-1.5">
              <label className="font-semibold">Endereço</label>
              <p className="text-sm text-muted-foreground">{student.address}</p>
            </div>
          )}
          
          {/* Campos personalizados */}
          {filteredCustomFields.map(([fieldId]) => (
            <div key={fieldId} className="flex flex-col space-y-1.5">
              <label className="font-semibold">
                {getFieldLabel(fieldId)}
              </label>
              <p className="text-sm text-muted-foreground">
                {getFieldValue(fieldId)}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}