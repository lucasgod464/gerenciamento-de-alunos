import { supabase } from "@/integrations/supabase/client"
import { Company, mapCompanyToSupabase, mapSupabaseCompany } from "@/types/company"

export async function createCompany(newCompany: Omit<Company, "id" | "createdAt">) {
  console.log("Criando nova empresa:", newCompany)
  
  try {
    const supabaseCompany = mapCompanyToSupabase(newCompany)
    
    const { data, error } = await supabase
      .from("companies")
      .insert([supabaseCompany])
      .select(`
        *,
        emails:emails(count),
        rooms:rooms(count)
      `)
      .single()

    if (error) {
      console.error("Erro ao criar empresa:", error)
      throw new Error(error.message === "new row violates row-level security policy" 
        ? "Você não tem permissão para criar empresas"
        : "Erro ao criar empresa. Por favor, tente novamente.")
    }

    if (!data) {
      throw new Error("Não foi possível criar a empresa. Dados não retornados.")
    }

    return mapSupabaseCompany({
      ...data,
      current_users: data.emails[0]?.count || 0,
      current_rooms: data.rooms[0]?.count || 0,
    })
  } catch (error) {
    console.error("Erro ao criar empresa:", error)
    throw error
  }
}

export async function updateCompany(company: Company) {
  console.log("Atualizando empresa:", company)

  try {
    const { data: currentData } = await supabase
      .from("companies")
      .select(`
        *,
        emails:emails(count),
        rooms:rooms(count)
      `)
      .eq("id", company.id)
      .single()

    if (!currentData) {
      throw new Error("Empresa não encontrada")
    }

    const supabaseCompany = mapCompanyToSupabase(company)

    const { data, error } = await supabase
      .from("companies")
      .update(supabaseCompany)
      .eq("id", company.id)
      .select(`
        *,
        emails:emails(count),
        rooms:rooms(count)
      `)
      .single()

    if (error) {
      console.error("Erro ao atualizar empresa:", error)
      throw new Error(error.message === "new row violates row-level security policy" 
        ? "Você não tem permissão para atualizar esta empresa"
        : "Erro ao atualizar empresa. Por favor, tente novamente.")
    }

    if (!data) {
      throw new Error("Não foi possível atualizar a empresa. Dados não retornados.")
    }

    return mapSupabaseCompany({
      ...data,
      current_users: data.emails[0]?.count || 0,
      current_rooms: data.rooms[0]?.count || 0,
    })
  } catch (error) {
    console.error("Erro ao atualizar empresa:", error)
    throw error
  }
}

export async function deleteCompany(id: string) {
  console.log("Deletando empresa:", id)
  
  try {
    // Primeiro verificamos se existem usuários vinculados
    const { data: users, error: usersError } = await supabase
      .from("emails")
      .select("id")
      .eq("company_id", id);

    if (usersError) throw usersError;
    
    if (users && users.length > 0) {
      throw new Error("Não é possível excluir esta empresa pois existem usuários vinculados. Remova todos os usuários primeiro.");
    }

    // Depois verificamos se existem salas vinculadas
    const { data: rooms, error: roomsError } = await supabase
      .from("rooms")
      .select("id")
      .eq("company_id", id);

    if (roomsError) throw roomsError;
    
    if (rooms && rooms.length > 0) {
      throw new Error("Não é possível excluir esta empresa pois existem salas vinculadas. Remova todas as salas primeiro.");
    }

    // Se não houver dependências, podemos excluir a empresa
    const { error: deleteError } = await supabase
      .from("companies")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Erro ao deletar empresa:", deleteError);
      throw new Error(deleteError.message === "new row violates row-level security policy" 
        ? "Você não tem permissão para deletar esta empresa"
        : "Erro ao deletar empresa. Por favor, tente novamente.");
    }

    return id;
  } catch (error) {
    console.error("Erro ao deletar empresa:", error);
    throw error;
  }
}