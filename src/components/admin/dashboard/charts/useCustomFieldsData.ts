import { useState, useEffect } from "react";
import { FormField } from "@/types/form";
import { Student, mapSupabaseStudent } from "@/types/student";
import { supabase } from "@/integrations/supabase/client";

export const useCustomFieldsData = (companyId?: string) => {
  const [fields, setFields] = useState<FormField[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFields = async () => {
      if (!companyId) return;

      try {
        const [{ data: adminFields, error: adminError }, { data: publicFields, error: publicError }] = await Promise.all([
          supabase
            .from('admin_form_fields')
            .select('*')
            .eq('company_id', companyId)
            .eq('form_type', 'admin')
            .in('type', ['select', 'multiple'])
            .order('order'),
          supabase
            .from('enrollment_form_fields')
            .select('*')
            .eq('company_id', companyId)
            .eq('form_type', 'enrollment')
            .in('type', ['select', 'multiple'])
            .order('order')
        ]);

        if (adminError) {
          console.error("Erro ao carregar campos admin:", adminError);
          throw adminError;
        }
        if (publicError) {
          console.error("Erro ao carregar campos públicos:", publicError);
          throw publicError;
        }

        const mappedAdminFields: FormField[] = (adminFields || []).map(field => ({
          id: field.id,
          name: field.name,
          label: field.label,
          type: field.type as FormField['type'],
          description: field.description || "",
          required: field.required || false,
          order: field.order,
          options: Array.isArray(field.options) ? field.options.map(String) : [],
          source: 'admin' as const
        }));

        const mappedPublicFields: FormField[] = (publicFields || []).map(field => ({
          id: field.id,
          name: field.name,
          label: field.label,
          type: field.type as FormField['type'],
          description: field.description || "",
          required: field.required || false,
          order: field.order,
          options: Array.isArray(field.options) ? field.options.map(String) : [],
          source: 'public' as const
        }));

        setFields([...mappedAdminFields, ...mappedPublicFields]);
      } catch (error) {
        console.error('Erro ao carregar campos:', error);
      }
    };

    const loadStudents = async () => {
      if (!companyId) return;

      try {
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .eq('company_id', companyId);

        if (error) throw error;

        if (data) {
          const mappedStudents = data.map(student => ({
            ...mapSupabaseStudent(student),
            customFields: typeof student.custom_fields === 'string' 
              ? JSON.parse(student.custom_fields) 
              : student.custom_fields || {}
          }));
          console.log("Alunos mapeados:", mappedStudents);
          setStudents(mappedStudents);
        }
      } catch (error) {
        console.error('Erro ao carregar alunos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFields();
    loadStudents();
  }, [companyId]);

  return { fields, students, isLoading };
};