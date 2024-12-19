export interface Email {
  id: string
  name: string
  email: string
  access_level: "Admin" | "Usuário Comum"
  company_id: string | null
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
}