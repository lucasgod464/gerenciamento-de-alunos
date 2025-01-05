import { supabase } from "@/integrations/supabase/client"
import { Company } from "@/types/company"
import { toast } from "@/components/ui/use-toast"

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
    .select(`
      *,
      emails:emails(count),
      rooms:rooms(count)
    `)
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
    currentUsers: data.emails[0]?.count || 0,
    roomsLimit: data.rooms_limit,
    currentRooms: data.rooms[0]?.count || 0,
    status: data.status,
    createdAt: new Date(data.created_at).toLocaleDateString(),
    publicFolderPath: data.public_folder_path,
    storageUsed: data.storage_used,
  }
}

export async function updateCompany(company: Company) {
  console.log("Updating company:", company)

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
    console.error("Error updating company:", error)
    throw error
  }

  return {
    id: data.id,
    name: data.name,
    document: data.document,
    usersLimit: data.users_limit,
    currentUsers: data.emails[0]?.count || 0,
    roomsLimit: data.rooms_limit,
    currentRooms: data.rooms[0]?.count || 0,
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