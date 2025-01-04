import { useState, useEffect } from "react";
import { FormField } from "@/types/form";
import { PublicEnrollmentForm } from "@/components/enrollment/PublicEnrollmentForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";

export function PublicEnrollment() {
  const [fields, setFields] = useState<FormField[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get('company');

  useEffect(() => {
    if (!companyId) {
      toast({
        title: "Erro",
        description: "ID da empresa não fornecido na URL",
        variant: "destructive",
      });
      return;
    }
    loadFields();
  }, [companyId]);

  const loadFields = async () => {
    try {
      console.log("Loading fields for company:", companyId);
      
      // Carrega campos personalizados da empresa
      const { data: customFields, error: customError } = await supabase
        .from('enrollment_form_fields')
        .select('*')
        .eq('company_id', companyId)
        .order('order');

      if (customError) {
        console.error("Error loading custom fields:", customError);
        throw customError;
      }

      console.log("Custom fields loaded:", customFields);

      // Campos padrão do sistema
      const defaultFields: FormField[] = [
        {
          id: "nome_completo",
          name: "nome_completo",
          label: "Nome Completo",
          type: "text",
          required: true,
          order: 0,
          isDefault: true
        },
        {
          id: "data_nascimento",
          name: "data_nascimento",
          label: "Data de Nascimento",
          type: "date",
          required: true,
          order: 1,
          isDefault: true
        }
      ];

      // Mapeia os campos personalizados para o formato correto
      const mappedCustomFields: FormField[] = (customFields || []).map(field => ({
        id: field.id,
        name: field.name,
        label: field.label,
        type: field.type as FormField['type'],
        description: field.description || undefined,
        required: field.required || false,
        order: field.order,
        options: field.options as string[] | undefined,
        isDefault: false
      }));

      console.log("Mapped custom fields:", mappedCustomFields);

      // Combina e ordena todos os campos
      const allFields = [...defaultFields, ...mappedCustomFields].sort((a, b) => a.order - b.order);
      console.log("All fields combined:", allFields);
      
      setFields(allFields);
    } catch (error) {
      console.error("Error loading form fields:", error);
      toast({
        title: "Erro ao carregar formulário",
        description: "Não foi possível carregar os campos do formulário.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: any) => {
    if (!companyId) {
      toast({
        title: "Erro",
        description: "ID da empresa não fornecido",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const customFields: Record<string, any> = {};
      fields.forEach(field => {
        if (!field.isDefault) {
          customFields[field.id] = {
            fieldId: field.id,
            fieldName: field.name,
            label: field.label,
            value: data[field.name],
            type: field.type
          };
        }
      });

      const { error: studentError } = await supabase
        .from('students')
        .insert({
          name: data.nome_completo,
          birth_date: data.data_nascimento,
          status: true,
          custom_fields: customFields,
          company_id: companyId
        });

      if (studentError) throw studentError;

      toast({
        title: "Sucesso!",
        description: "Formulário enviado com sucesso.",
      });

      // Reset form
      Object.keys(data).forEach(key => {
        setValue(key, '');
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erro ao enviar formulário",
        description: "Não foi possível enviar o formulário. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!companyId) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-red-600">
              Erro: Link Inválido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">
              Este link de formulário é inválido. Por favor, solicite um novo link.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Formulário de Inscrição
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PublicEnrollmentForm 
            fields={fields}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default PublicEnrollment;