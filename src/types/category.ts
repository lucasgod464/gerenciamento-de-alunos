export interface Category {
  id: string;
  name: string;
  status: boolean;
  companyId: string | null;
  color?: string;
}