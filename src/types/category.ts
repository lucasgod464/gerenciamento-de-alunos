export interface Category {
  id: string;
  name: string;
  status: boolean;
  company_id: string | null;
  color?: string;
  created_at?: string;
}