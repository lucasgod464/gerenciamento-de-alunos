import { supabase } from "@/integrations/supabase/client"
import { Company } from "@/types/company"

export async function createCompany(newCompany: Omit<Company, "id" | "createdAt">) {
  console.log("Criando nova empresa:", newCompany)
  
  try {
    const { data, error } = await supabase
      .from("companies")
      .insert([{
        name: newCompany.name,
        document: newCompany.document,
        users_limit: newCompany.usersLimit,
        rooms_limit: newCompany.roomsLimit,
        status: newCompany.status,
        public_folder_path: newCompany.publicFolderPath,
        storage_used: 0,
      }])
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

    return {
      id: data.id,
      name: data.name,
      document: data.document,
      usersLimit: data.users_limit,
      currentUsers: data.emails[0]?.count || 0,
      roomsLimit: data.rooms_limit,
      currentRooms: data.rooms[0]?.count || 0,
      status: data.status as Company["status"],
      createdAt: new Date(data.created_at).toLocaleDateString(),
      publicFolderPath: data.public_folder_path,
      storageUsed: data.storage_used,
    }
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

    const { data, error } = await supabase
      .from("companies")
      .update({
        name: company.name,
        users_limit: company.usersLimit,
        rooms_limit: company.roomsLimit,
        status: company.status,
        current_users: currentData.emails[0]?.count || 0,
        current_rooms: currentData.rooms[0]?.count || 0
      })
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

    return {
      id: data.id,
      name: data.name,
      document: data.document,
      usersLimit: data.users_limit,
      currentUsers: data.emails[0]?.count || 0,
      roomsLimit: data.rooms_limit,
      currentRooms: data.rooms[0]?.count || 0,
      status: data.status as Company["status"],
      createdAt: new Date(data.created_at).toLocaleDateString(),
      publicFolderPath: data.public_folder_path,
      storageUsed: data.storage_used,
    }
  } catch (error) {
    console.error("Erro ao atualizar empresa:", error)
    throw error
  }
}

export async function deleteCompany(id: string) {
  console.log("Deletando empresa:", id)
  
  try {
    const { error } = await supabase
      .from("companies")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Erro ao deletar empresa:", error)
      throw new Error(error.message === "new row violates row-level security policy" 
        ? "Você não tem permissão para deletar esta empresa"
        : "Erro ao deletar empresa. Por favor, tente novamente.")
    }

    return id
  } catch (error) {
    console.error("Erro ao deletar empresa:", error)
    throw error
  }
}