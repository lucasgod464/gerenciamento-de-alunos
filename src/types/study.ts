export interface Study {
  id: string;
  name: string;
  status: "active" | "inactive" | "completed";
  startDate: string;
  endDate: string;
}