import { useState, useEffect } from "react";
import { FormField, mapSupabaseFormField, SupabaseFormField } from "@/types/form";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const useCustomFields = () => {
  const [fields, setFields] = useState<FormField[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadFields = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_form_fields')
          .select('*')
          .eq('company_id', user?.companyId)
          .order('order');

        if (error) throw error;

        const mappedFields = (data as SupabaseFormField[]).map(mapSupabaseFormField);
        setFields(mappedFields);
      } catch (error) {
        console.error('Erro ao carregar campos:', error);
        toast({
          title: "Erro ao carregar campos",
          description: "Não foi possível carregar os campos personalizados.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.companyId) {
      loadFields();
    }
  }, [user?.companyId]);

  return { fields, isLoading };
};