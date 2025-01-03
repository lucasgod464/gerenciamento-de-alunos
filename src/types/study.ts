export type StudyStatus = 'active' | 'inactive' | 'completed';

export interface Study {
  id: string;
  name: string;
  status: StudyStatus;
  startDate: string | null;
  endDate: string | null;
  companyId: string | null;
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
    startDate: study.start_date,
    endDate: study.end_date,
    companyId: study.company_id,
    createdAt: study.created_at,
  };
}