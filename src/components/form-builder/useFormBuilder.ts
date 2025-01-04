import { useState, useEffect } from "react";
import { FormField, SupabaseFormField, mapSupabaseFormField, mapFormFieldToSupabase } from "@/types/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useFormBuilder = () => {
  const [fields, setFields] = useState<FormField[]>([]);
  const { toast } = useToast();

  const loadFields = async () => {
    try {
      const { data: customFields, error } = await supabase
        .from('admin_form_fields')
        .select('*')
        .order('order');

      if (error) throw error;

      const mappedFields = (customFields as SupabaseFormField[]).map(mapSupabaseFormField);
      setFields(mappedFields);
    } catch (error) {
      console.error("Error loading form fields:", error);
      toast({
        title: "Erro ao carregar campos",
        description: "Não foi possível carregar os campos do formulário.",
        variant: "destructive",
      });
    }
  };

  const handleAddField = async (fieldData: Omit<FormField, "id" | "order">) => {
    try {
      const newField: FormField = {
        ...fieldData,
        id: crypto.randomUUID(),
        order: fields.length
      };

      const supabaseField = mapFormFieldToSupabase(newField);

      const { data, error } = await supabase
        .from('admin_form_fields')
        .insert([supabaseField])
        .select()
        .single();

      if (error) throw error;

      const mappedField = mapSupabaseFormField(data as SupabaseFormField);
      setFields(prev => [...prev, mappedField]);
      
      toast({
        title: "Campo adicionado",
        description: "O novo campo foi adicionado com sucesso.",
      });

      return mappedField;
    } catch (error) {
      console.error("Error adding field:", error);
      toast({
        title: "Erro ao adicionar campo",
        description: "Não foi possível adicionar o campo.",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    loadFields();
  }, []);

  return {
    fields,
    addField: handleAddField,
  };
};