import { useState, useEffect } from "react";
import { FormField } from "@/types/form";
import { Student } from "@/types/student";
import { supabase } from "@/integrations/supabase/client";

export const useCustomFieldsData = (companyId?: string) => {
  const [fields, setFields] = useState<FormField[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFields = async () => {
      if (!companyId) return;

      try {
        console.log("Carregando campos personalizados...");
        const [{ data: adminFields, error: adminError }, { data: publicFields, error: publicError }] = await Promise.all([
          supabase
            .from('admin_form_fields')
            .select('*')
            .eq('company_id', companyId)
            .in('type', ['select', 'multiple'])
            .order('order'),
          supabase
            .from('enrollment_form_fields')
            .select('*')
            .eq('company_id', companyId)
            .in('type', ['select', 'multiple'])
            .order('order')
        ]);

        if (adminError) throw adminError;
        if (publicError) throw publicError;

        console.log("Campos admin:", adminFields);
        console.log("Campos públicos:", publicFields);

        const mappedAdminFields: FormField[] = (adminFields || []).map(field => ({
          id: field.id,
          name: field.name,
          label: field.label,
          type: field.type as FormField['type'],
          description: field.description || "",
          required: field.required || false,
          order: field.order,
          options: Array.isArray(field.options) ? field.options.map(String) : [],
          source: 'admin'
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
          source: 'public'
        }));

        const allFields = [...mappedAdminFields, ...mappedPublicFields];
        console.log("Campos mapeados:", allFields);
        setFields(allFields);
      } catch (error) {
        console.error('Erro ao carregar campos:', error);
      }
    };

    const loadStudents = async () => {
      if (!companyId) return;

      try {
        console.log("Carregando alunos...");
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .eq('company_id', companyId);

        if (error) throw error;

        if (data) {
          const mappedStudents = data.map(student => ({
            id: student.id,
            name: student.name,
            birthDate: student.birth_date,
            status: student.status,
            email: student.email || '',
            document: student.document || '',
            address: student.address || '',
            customFields: student.custom_fields || {},
            companyId: student.company_id,
            createdAt: student.created_at
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