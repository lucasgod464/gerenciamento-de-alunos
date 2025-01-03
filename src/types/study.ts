export type StudyStatus = "active" | "inactive" | "completed";

export interface Study {
  id: string;
  name: string;
  status: StudyStatus;
  startDate?: string;
  endDate?: string;
  companyId?: string;
  createdAt: string;
}

export interface SupabaseStudy {
  id: string;
  name: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  company_id: string | null;
  created_at: string;
}

export function mapSupabaseStudyToStudy(study: SupabaseStudy): Study {
  return {
    id: study.id,
    name: study.name,
    status: study.status as StudyStatus,
    startDate: study.start_date || undefined,
    endDate: study.end_date || undefined,
    companyId: study.company_id || undefined,
    createdAt: study.created_at,
  };
}