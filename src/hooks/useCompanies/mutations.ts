import { supabase } from "@/integrations/supabase/client"
import { Company } from "@/types/company"

export async function createCompany(company: Omit<Company, "id" | "createdAt">) {
  const { data, error } = await supabase
    .from("companies")
    .insert([company])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateCompany(company: Company) {
  const { data, error } = await supabase
    .from("companies")
    .update(company)
    .eq("id", company.id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteCompany(id: string) {
  const { error } = await supabase
    .rpc('delete_company_cascade', { company_id: id })

  if (error) {
    console.error("Erro ao deletar empresa:", error)
    throw error
  }
  
  return true
}