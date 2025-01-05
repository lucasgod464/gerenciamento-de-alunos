import { supabase } from "@/integrations/supabase/client"
import { Company } from "@/components/companies/CompanyList"

export async function createCompany(newCompany: Omit<Company, "id" | "createdAt">) {
  console.log("Creating new company:", newCompany)
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
    .select()
    .single()

  if (error) {
    console.error("Error creating company:", error)
    throw error
  }

  return {
    id: data.id,
    name: data.name,
    document: data.document,
    usersLimit: data.users_limit,
    currentUsers: 0,
    roomsLimit: data.rooms_limit,
    currentRooms: 0,
    status: data.status,
    createdAt: new Date(data.created_at).toLocaleDateString(),
    publicFolderPath: data.public_folder_path,
    storageUsed: data.storage_used,
  }
}

export async function updateCompany(updatedCompany: Company) {
  console.log("Updating company:", updatedCompany)
  const { data, error } = await supabase
    .from("companies")
    .update({
      name: updatedCompany.name,
      users_limit: updatedCompany.usersLimit,
      rooms_limit: updatedCompany.roomsLimit,
      status: updatedCompany.status,
    })
    .eq("id", updatedCompany.id)
    .select()
    .single()

  if (error) {
    console.error("Error updating company:", error)
    throw error
  }

  return {
    id: data.id,
    name: data.name,
    document: data.document,
    usersLimit: data.users_limit,
    currentUsers: updatedCompany.currentUsers,
    roomsLimit: data.rooms_limit,
    currentRooms: updatedCompany.currentRooms,
    status: data.status,
    createdAt: new Date(data.created_at).toLocaleDateString(),
    publicFolderPath: data.public_folder_path,
    storageUsed: data.storage_used,
  }
}

export async function deleteCompany(id: string) {
  console.log("Deleting company:", id)
  const { error } = await supabase
    .from("companies")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting company:", error)
    throw error
  }

  return id
}