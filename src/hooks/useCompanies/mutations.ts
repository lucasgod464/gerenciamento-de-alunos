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
    // Primeiro deletamos os campos de formulário de inscrição
    const { error: deleteEnrollmentFieldsError } = await supabase
      .from("enrollment_form_fields")
      .delete()
      .eq("company_id", id)

    if (deleteEnrollmentFieldsError) throw deleteEnrollmentFieldsError

    // Depois deletamos os campos de formulário administrativo
    const { error: deleteAdminFieldsError } = await supabase
      .from("admin_form_fields")
      .delete()
      .eq("company_id", id)

    if (deleteAdminFieldsError) throw deleteAdminFieldsError

    // Deletamos todas as especializações vinculadas
    const { error: deleteSpecializationsError } = await supabase
      .from("specializations")
      .delete()
      .eq("company_id", id)

    if (deleteSpecializationsError) throw deleteSpecializationsError

    // Deletamos todos os usuários vinculados
    const { error: deleteEmailsError } = await supabase
      .from("emails")
      .delete()
      .eq("company_id", id)

    if (deleteEmailsError) throw deleteEmailsError

    // Deletamos todas as salas vinculadas
    const { error: deleteRoomsError } = await supabase
      .from("rooms")
      .delete()
      .eq("company_id", id)

    if (deleteRoomsError) throw deleteRoomsError

    // Deletamos todas as categorias vinculadas
    const { error: deleteCategoriesError } = await supabase
      .from("categories")
      .delete()
      .eq("company_id", id)

    if (deleteCategoriesError) throw deleteCategoriesError

    // Deletamos todas as tags vinculadas
    const { error: deleteTagsError } = await supabase
      .from("tags")
      .delete()
      .eq("company_id", id)

    if (deleteTagsError) throw deleteTagsError

    // Deletamos todos os estudantes vinculados
    const { error: deleteStudentsError } = await supabase
      .from("students")
      .delete()
      .eq("company_id", id)

    if (deleteStudentsError) throw deleteStudentsError

    // Finalmente deletamos a empresa
    const { error: deleteCompanyError } = await supabase
      .from("companies")
      .delete()
      .eq("id", id)

    if (deleteCompanyError) {
      console.error("Erro ao deletar empresa:", deleteCompanyError)
      throw new Error(deleteCompanyError.message === "new row violates row-level security policy" 
        ? "Você não tem permissão para deletar esta empresa"
        : "Erro ao deletar empresa. Por favor, tente novamente.")
    }

    return id
  } catch (error) {
    console.error("Erro ao deletar empresa:", error)
    throw error
  }
}