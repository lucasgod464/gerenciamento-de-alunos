import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/types/form";
import StudentForm from "@/components/user/StudentForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PublicEnrollment = () => {
  const { companyId } = useParams();
  const [fields, setFields] = useState<FormField[]>([]);
  const [companyName, setCompanyName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const loadFormFields = async () => {
      if (!companyId) {
        toast({
          title: "Erro",
          description: "Link de formulário inválido",
          variant: "destructive",
        });
        return;
      }

      try {
        // Load company info
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('name')
          .eq('id', companyId)
          .single();

        if (companyError || !companyData) {
          throw new Error('Empresa não encontrada');
        }

        setCompanyName(companyData.name);

        // Load form fields
        const { data: fieldsData, error: fieldsError } = await supabase
          .from('enrollment_form_fields')
          .select('*')
          .eq('company_id', companyId)
          .order('order');

        if (fieldsError) throw fieldsError;

        const defaultFields: FormField[] = [
          {
            id: "nome_completo",
            name: "nome_completo",
            label: "Nome Completo",
            type: "text",
            required: true,
            order: 0,
          },
          {
            id: "data_nascimento",
            name: "data_nascimento",
            label: "Data de Nascimento",
            type: "date",
            required: true,
            order: 1,
          }
        ];

        const customFields = fieldsData.map(field => ({
          id: field.id,
          name: field.name,
          label: field.label,
          type: field.type as FormField['type'],
          description: field.description || '',
          required: field.required,
          order: field.order,
          options: field.options as string[] | undefined,
        }));

        setFields([...defaultFields, ...customFields]);
      } catch (error) {
        console.error('Error loading form:', error);
        toast({
          title: "Erro ao carregar formulário",
          description: "Não foi possível carregar o formulário de inscrição.",
          variant: "destructive",
        });
      }
    };

    loadFormFields();
  }, [companyId, toast]);

  const handleSubmit = async (formData: any) => {
    if (!companyId) return;

    try {
      const { error } = await supabase
        .from('students')
        .insert([{ ...formData, company_id: companyId }]);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Inscrição realizada com sucesso!",
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Erro ao enviar formulário",
        description: "Não foi possível realizar a inscrição.",
        variant: "destructive",
      });
    }
  };

  if (!companyId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-center text-red-600">
              Link de formulário inválido
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center">
            Formulário de Inscrição - {companyName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StudentForm 
            fields={fields} 
            onSubmit={handleSubmit}
            submitButtonText="Realizar Inscrição"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicEnrollment;