import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/user";

interface CreateUserData extends Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
  password: string;
}

export const createUser = async (userData: CreateUserData) => {
  try {
    const { data, error } = await supabase
      .from('emails')
      .insert([
        {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          access_level: userData.accessLevel,
          company_id: userData.companyId,
          location: userData.location,
          specialization: userData.specialization,
          status: userData.status,
        }
      ])
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const userService = {
  createUser,
  async updateUser(userData: User) {
    try {
      const { data, error } = await supabase
        .from('emails')
        .update({
          name: userData.name,
          email: userData.email,
          access_level: userData.accessLevel,
          company_id: userData.companyId,
          location: userData.location,
          specialization: userData.specialization,
          status: userData.status,
        })
        .eq('id', userData.id)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  async deleteUser(userId: string) {
    try {
      const { error } = await supabase
        .from('emails')
        .delete()
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  async fetchUsers(companyId: string) {
    try {
      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .eq('company_id', companyId);

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
};
