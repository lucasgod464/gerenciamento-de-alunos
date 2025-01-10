import { supabase } from "@/integrations/supabase/client"
import { Company, mapSupabaseCompany } from "@/types/company"

export async function fetchCompanies(): Promise<Company[]> {
  console.log("Fetching companies from Supabase")
  
  const { data, error } = await supabase
    .from("companies")
    .select(`
      *,
      emails:emails(count),
      rooms:rooms(count)
    `)
  
  if (error) {
    console.error("Error fetching companies:", error)
    throw error
  }

  return data.map(company => mapSupabaseCompany({
    ...company,
    current_users: company.emails[0]?.count || 0,
    current_rooms: company.rooms[0]?.count || 0,
  }))
}