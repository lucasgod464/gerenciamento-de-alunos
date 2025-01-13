import { useState, useEffect } from "react";
import { FormField, mapSupabaseFormField } from "@/types/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export const useCustomFields = () => {
  const [fields, setFields] = useState<FormField[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadCustomFields = async () => {
      try {
        const { data: customFields, error } = await supabase
          .from('admin_form_fields')
          .select('*')
          .order('order');

        if (error) throw error;

        const mappedFields = (customFields || []).map(mapSupabaseFormField);
        setFields(mappedFields);
      } catch (error) {
        console.error("Error loading custom fields:", error);
        toast({
          title: "Erro ao carregar campos",
          description: "Não foi possível carregar os campos personalizados.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCustomFields();
  }, []);

  return { fields, isLoading };
};
