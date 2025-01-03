export type StudyStatus = "active" | "inactive" | "completed";

export interface Study {
  id: string;
  name: string;
  status: StudyStatus;
  startDate: string | null;
  endDate: string | null;
  companyId: string | null;
  createdAt: string;
}