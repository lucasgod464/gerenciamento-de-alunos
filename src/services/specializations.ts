import { supabase } from "@/integrations/supabase/client";
import type { Specialization } from "@/types/specialization";

export const specializationService = {
  async getSpecializations() {
    const { data, error } = await supabase
      .from('specializations')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data as Specialization[];
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
    return data as Specialization;
  },

  async updateSpecialization(id: string, name: string) {
    const { data, error } = await supabase
      .from('specializations')
      .update({ name })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Specialization;
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

export type { Specialization };