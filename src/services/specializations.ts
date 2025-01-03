import { supabase } from "@/integrations/supabase/client";

export interface Specialization {
  id: string;
  name: string;
  status: boolean;
  company_id: string | null;
  description: string | null;
  created_at: string;
}

export const specializationService = {
  async getSpecializations() {
    const { data, error } = await supabase
      .from('specializations')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async createSpecialization(name: string, companyId: string) {
    const { data, error } = await supabase
      .from('specializations')
      .insert([
        { 
          name,
          company_id: companyId,
          status: true
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateSpecialization(id: string, name: string) {
    const { data, error } = await supabase
      .from('specializations')
      .update({ name })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteSpecialization(id: string) {
    const { error } = await supabase
      .from('specializations')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async toggleStatus(id: string, status: boolean) {
    const { error } = await supabase
      .from('specializations')
      .update({ status: !status })
      .eq('id', id);
    
    if (error) throw error;
  }
};