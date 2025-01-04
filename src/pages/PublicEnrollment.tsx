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
      console.log("Iniciando carregamento dos campos para empresa:", companyId);
      
      // Carrega campos personalizados da empresa
      const { data: customFields, error: customError } = await supabase
        .from('enrollment_form_fields')
        .select('*')
        .eq('company_id', companyId)
        .order('order');

      if (customError) {
        console.error("Erro ao carregar campos personalizados:", customError);
        throw customError;
      }

      console.log("Campos personalizados brutos:", customFields);

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
      const mappedCustomFields: FormField[] = customFields ? customFields.map(field => ({
        id: field.id,
        name: field.name,
        label: field.label,
        type: field.type as FormField['type'],
        description: field.description || undefined,
        required: field.required || false,
        order: field.order,
        options: field.options as string[] | undefined,
        isDefault: false
      })) : [];

      console.log("Campos personalizados mapeados:", mappedCustomFields);

      // Combina e ordena todos os campos
      const allFields = [...defaultFields, ...mappedCustomFields].sort((a, b) => a.order - b.order);
      console.log("Todos os campos combinados e ordenados:", allFields);
      
      setFields(allFields);
    } catch (error) {
      console.error("Erro ao carregar campos do formulário:", error);
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

    console.log("Dados do formulário recebidos:", data);
    console.log("Campos disponíveis:", fields);

    setIsSubmitting(true);
    try {
      // Prepara os campos personalizados
      const customFields: Record<string, any> = {};
      fields.forEach(field => {
        if (!field.isDefault) {
          console.log(`Processando campo personalizado: ${field.name}`, {
            valor: data[field.name],
            campo: field
          });
          
          customFields[field.name] = {
            fieldId: field.id,
            fieldName: field.name,
            label: field.label,
            value: data[field.name],
            type: field.type
          };
        }
      });

      console.log("Campos personalizados preparados:", customFields);

      const { error: studentError } = await supabase
        .from('students')
        .insert({
          name: data.nome_completo,
          birth_date: data.data_nascimento,
          status: true,
          custom_fields: customFields,
          company_id: companyId
        });

      if (studentError) {
        console.error("Erro ao inserir estudante:", studentError);
        throw studentError;
      }

      toast({
        title: "Sucesso!",
        description: "Formulário enviado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
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