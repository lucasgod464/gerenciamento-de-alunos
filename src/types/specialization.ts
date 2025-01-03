export interface Specialization {
  id: string;
  name: string;
  description: string | null;
  status: boolean;
  company_id: string | null;
  created_at: string;
}

export interface SupabaseSpecialization {
  id: string;
  name: string;
  description: string | null;
  status: boolean;
  company_id: string | null;
  created_at: string;
}

export function mapSupabaseSpecializationToSpecialization(
  supabaseSpec: SupabaseSpecialization
): Specialization {
  return {
    id: supabaseSpec.id,
    name: supabaseSpec.name,
    description: supabaseSpec.description,
    status: supabaseSpec.status,
    company_id: supabaseSpec.company_id,
    created_at: supabaseSpec.created_at,
  };
}