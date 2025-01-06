import { useEffect, useState } from "react";
import { CustomFieldsChart } from "./CustomFieldsChart";
import { FormField } from "@/types/form";
import { Student } from "@/types/student";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const DashboardCharts = () => {
  const [fields, setFields] = useState<FormField[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!user?.companyId) return;

        // Carregar campos personalizados
        const { data: customFields, error: fieldsError } = await supabase
          .from('admin_form_fields')
          .select('*')
          .eq('company_id', user.companyId)
          .order('order');

        if (fieldsError) throw fieldsError;

        if (customFields) {
          setFields(customFields.map(field => ({
            id: field.id,
            name: field.name,
            label: field.label,
            type: field.type as FormField['type'],
            description: field.description || undefined,
            required: field.required || false,
            order: field.order,
            options: field.options as string[] | undefined,
          })));
        }

        // Carregar estudantes
        const { data: studentsData, error: studentsError } = await supabase
          .from('students')
          .select('*')
          .eq('company_id', user.companyId);

        if (studentsError) throw studentsError;

        if (studentsData) {
          setStudents(studentsData.map(student => ({
            id: student.id,
            name: student.name,
            birthDate: student.birth_date,
            status: student.status ?? true,
            email: student.email || '',
            document: student.document || '',
            address: student.address || '',
            customFields: student.custom_fields || {},
            companyId: student.company_id,
            createdAt: student.created_at,
          })));
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados para os gráficos.",
          variant: "destructive",
        });
      }
    };

    loadData();
  }, [user?.companyId]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Análise de Campos Personalizados</h2>
        <p className="text-muted-foreground">
          Visualize estatísticas baseadas nos campos personalizados dos alunos
        </p>
      </div>
      <CustomFieldsChart fields={fields} students={students} />
    </div>
  );
};