import { supabase } from "@/integrations/supabase/client"
import { Company } from "@/components/companies/CompanyList"

export async function fetchCompanies() {
  console.log("Fetching companies from Supabase")
  const { data, error } = await supabase
    .from("companies")
    .select(`
      *,
      rooms:rooms(count),
      users:emails(count)
    `)
  
  if (error) {
    console.error("Error fetching companies:", error)
    throw error
  }

  // Map the snake_case response to camelCase Company interface
  return data.map(company => ({
    id: company.id,
    name: company.name,
    document: company.document,
    usersLimit: company.users_limit,
    currentUsers: company.users.count || 0,
    roomsLimit: company.rooms_limit,
    currentRooms: company.rooms.count || 0,
    status: company.status,
    createdAt: new Date(company.created_at).toLocaleDateString(),
    publicFolderPath: company.public_folder_path,
    storageUsed: company.storage_used,
  }))
}