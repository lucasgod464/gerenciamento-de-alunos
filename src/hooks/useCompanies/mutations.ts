import { supabase } from "@/integrations/supabase/client"
import { Company } from "@/types/company"

export async function createCompany(company: Omit<Company, "id" | "createdAt">) {
  const { data, error } = await supabase
    .from("companies")
    .insert([{
      name: company.name,
      document: company.document,
      users_limit: company.usersLimit,
      current_users: company.currentUsers,
      rooms_limit: company.roomsLimit,
      current_rooms: company.currentRooms,
      status: company.status,
      public_folder_path: company.publicFolderPath,
      storage_used: company.storageUsed,
      enrollment_form_url: company.enrollmentFormUrl
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateCompany(company: Company) {
  const { data, error } = await supabase
    .from("companies")
    .update({
      name: company.name,
      document: company.document,
      users_limit: company.usersLimit,
      current_users: company.currentUsers,
      rooms_limit: company.roomsLimit,
      current_rooms: company.currentRooms,
      status: company.status,
      public_folder_path: company.publicFolderPath,
      storage_used: company.storageUsed,
      enrollment_form_url: company.enrollmentFormUrl
    })
    .eq("id", company.id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteCompany(id: string) {
  const { error } = await supabase
    .rpc('delete_company_cascade', { 
      target_company_id: id 
    })

  if (error) {
    console.error("Erro ao deletar empresa:", error)
    throw error
  }
  
  return true
}