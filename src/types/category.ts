export interface Category {
  id: string;
  name: string;
  status: boolean;
  companyId?: string | null;
  company_id?: string | null; // Added to match Supabase schema
  color?: string;
  created_at?: string;
}